export class AppError extends Error {
  status: number;
  details?: any;
  constructor({
    message,
    status = 500,
    details,
  }: {
    message: string;
    status?: number;
    details?: any;
  }) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.details = details;

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      details: this.details,
    };
  }
}

export default AppError;
