// A driver-agnostic parser that turns Drizzle/driver errors into user-friendly messages.
// Works with Postgres (pg/postgres), MySQL (mysql2), and SQLite (better-sqlite3/libsql).

type ParsedDrizzleError = {
  messages: string[];
} & Record<string, unknown>;

export function parseDrizzleError(err: unknown): ParsedDrizzleError {
  const e = normalizeError(err);
  const messages: string[] = [];

  // Prefer parsing the deepest cause (driver error), then fall back to outer error
  const driverErr =
    e.cause && typeof e.cause === "object" ? (e.cause as any) : e;

  if (isPostgresError(driverErr)) {
    const msg = pgMessage(driverErr);
    if (msg) messages.push(msg);
  } else if (isMysqlError(driverErr)) {
    const msg = mysqlMessage(driverErr);
    if (msg) messages.push(msg);
  } else if (isSqliteError(driverErr)) {
    const msg = sqliteMessage(driverErr);
    if (msg) messages.push(msg);
  }

  // Fallbacks if nothing mapped
  if (messages.length === 0) {
    if (typeof e.message === "string" && e.message.trim()) {
      messages.push(sanitize(e.message));
    } else {
      messages.push("Database error occurred");
    }
  }

  // Return messages + a flattened, serializable snapshot of relevant fields
  return {
    messages,
    // Outer error
    name: e.name,
    message: e.message,
    stack: e.stack,
    // Common fields
    code: (e as any).code,
    errno: (e as any).errno,
    sqlState: (e as any).sqlState || (e as any).code,
    detail: (e as any).detail,
    schema: (e as any).schema,
    table: (e as any).table,
    column: (e as any).column,
    constraint: (e as any).constraint,
    // Driver-specific extras
    routine: (e as any).routine,
    parameters: (e as any).parameters,
    sql: (e as any).sql,
    sqlMessage: (e as any).sqlMessage,
    // Cause snapshot (if any)
    cause: snapshotCause(e.cause),
  };
}

/* ------------------------- Helpers & mappers ------------------------- */

function normalizeError(err: unknown): any {
  if (err && typeof err === "object") return err as any;
  return { name: "Error", message: String(err) };
}

function sanitize(s: string): string {
  // Trim and collapse whitespace; avoid leaking raw SQL in generic outputs
  return s.replace(/\s+/g, " ").trim();
}

function snapshotCause(cause: unknown) {
  if (!cause || typeof cause !== "object") return undefined;
  const c: any = cause;
  return {
    name: c.name,
    message: c.message,
    code: c.code,
    errno: c.errno,
    sqlState: c.sqlState || c.code,
    detail: c.detail,
    schema: c.schema,
    table: c.table,
    column: c.column,
    constraint: c.constraint,
  };
}

/* ---------- Type guards for common driver error shapes ---------- */

// Postgres (pg or postgres)
function isPostgresError(e: any): e is {
  code?: string;
  detail?: string;
  table?: string;
  column?: string;
  constraint?: string;
} {
  return typeof e?.code === "string" && /^[0-9A-Z]{5}$/.test(e.code);
}

// MySQL (mysql2)
function isMysqlError(e: any): e is {
  code?: string; // e.g., 'ER_DUP_ENTRY'
  errno?: number; // e.g., 1062
  sqlMessage?: string;
  sqlState?: string;
} {
  return typeof e?.errno === "number" || typeof e?.code === "string";
}

// SQLite (better-sqlite3/libsql)
function isSqliteError(e: any): e is {
  code?: string; // e.g., 'SQLITE_CONSTRAINT'
  message?: string;
} {
  return typeof e?.code === "string" && e.code.startsWith("SQLITE");
}

/* ---------- Human-friendly message builders ---------- */

// Postgres SQLSTATE mappings: https://www.postgresql.org/docs/current/errcodes-appendix.html
function pgMessage(e: any): string | null {
  const code = e.code as string | undefined;
  const table = e.table as string | undefined;
  const column = e.column as string | undefined;
  const constraint = e.constraint as string | undefined;
  const detail = e.detail as string | undefined;

  switch (code) {
    case "23505": // unique_violation
      return detail
        ? humanizeDuplicate(detail)
        : hint(
            `Duplicate value violates unique constraint${
              constraint ? ` '${constraint}'` : ""
            }`,
            table,
            column
          );
    case "23503": // foreign_key_violation
      return hint(
        "Related record does not exist (foreign key violation)",
        table,
        column
      );
    case "23502": // not_null_violation
      return hint("Required field is missing", table, column);
    case "23514": // check_violation
      return constraint
        ? `Value violates rule '${constraint}'`
        : "Value violates a check constraint";
    case "22001": // string_data_right_truncation
      return hint("Value is too long", table, column);
    case "22P02": // invalid_text_representation
      return hint("Invalid value format", table, column);
    default:
      return sanitize(e.message || "Database error");
  }
}

// MySQL errno/code mappings: https://dev.mysql.com/doc/refman/8.0/en/server-error-reference.html
function mysqlMessage(e: any): string | null {
  const errno = e.errno as number | undefined;
  const code = e.code as string | undefined;
  const msg = e.sqlMessage as string | undefined;
  const base = msg || e.message;

  switch (errno) {
    case 1062: // ER_DUP_ENTRY
      return humanizeDuplicate(base || "Duplicate entry");
    case 1452: // ER_NO_REFERENCED_ROW_2 (FK)
      return "Related record does not exist (foreign key violation)";
    case 1048: // ER_BAD_NULL_ERROR
      return "Required field is missing";
    case 1406: // ER_DATA_TOO_LONG
      return "Value is too long";
    default:
      if (code === "ER_DUP_ENTRY")
        return humanizeDuplicate(base || "Duplicate entry");
      return sanitize(base || "Database error");
  }
}

// SQLite generic constraint parsing
function sqliteMessage(e: any): string | null {
  const msg = String(e.message || "");
  if (/UNIQUE/i.test(msg)) return humanizeDuplicate(msg);
  if (/NOT\s+NULL/i.test(msg)) return "Required field is missing";
  if (/foreign key/i.test(msg))
    return "Related record does not exist (foreign key violation)";
  if (/too long|string\s+data\s+right\s+truncation/i.test(msg))
    return "Value is too long";
  return sanitize(msg || "Database error");
}

/* ----------------------------- Utilities ----------------------------- */

function humanizeDuplicate(text: string): string {
  // Try to pull column=value from common driver messages
  // PG detail: Key (email)=(a@b.com) already exists.
  const m = text.match(/Key\s+\((.+?)\)=\((.+?)\)\s+already exists/i);
  if (m) return `Duplicate value for ${m[1]}: ${m[2]}`;

  // MySQL: Duplicate entry 'a@b.com' for key 'users.email'
  const m2 = text.match(/Duplicate entry '(.+?)' for key '(.+?)'/i);
  if (m2)
    return `Duplicate value '${m2[1]}' for ${simplifyKey(m2[2] as string)}`;

  return "Duplicate value violates unique constraint";
}

function simplifyKey(k: string): string {
  // Turn 'users.email' or 'users_email_key' into 'email'
  const dot = k.split(".");
  const last = dot[dot.length - 1];
  return (last as any).replace(/_key$/i, "");
}

function hint(baseMessage: string, table?: string, column?: string): string {
  const parts = [baseMessage];
  if (table) parts.push(`on table '${table}'`);
  if (column) parts.push(`column '${column}'`);
  return parts.join(" ");
}
