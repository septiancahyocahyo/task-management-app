export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
    public readonly errors?: Record<
      string,
      string
    >
  ) {
    super(message);
    this.name = "AppError";
  }
}