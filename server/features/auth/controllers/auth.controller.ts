import { ZodError } from "zod";

import { registerSchema } from "../schemas/register.schema";
import { registerUser } from "../services/auth.service";
import { AppError } from "@/lib/api-error";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function registerController(
  req: Request
) {
  try {
    const body = await req.json();

    const validatedData =
      registerSchema.parse(body);

    const user =
      await registerUser(validatedData);

    return successResponse(user, "Registration successful", 201);
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = Object.fromEntries(
        error.issues.map((err) => [err.path[0], err.message])
      );
      return errorResponse("Validation error", 400, errors);
    }

    if (error instanceof AppError) {
      return errorResponse(
        error.message,
        error.statusCode,
        error.errors
      );
    }

    return errorResponse("Something went wrong", 500);
  }
}