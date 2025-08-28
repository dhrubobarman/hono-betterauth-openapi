import AppError from "@/utils/Errors/AppError";

export class UnauthenticatedError extends AppError {
  constructor({ message, details }: { message: string; details?: any }) {
    super({ message, details });
    this.status = 401;
  }
}
