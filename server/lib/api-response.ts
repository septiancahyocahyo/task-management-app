import { NextResponse } from "next/server";

type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

type ErrorResponse = {
  success: false;
  message: string;
  errors?: Record<string, string>;
};

export function successResponse<T>(
  data: T,
  message = "Success",
  status = 200
) {
  const body: SuccessResponse<T> = { success: true, message, data };
  return NextResponse.json(body, { status });
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: Record<string, string>
) {
  const body: ErrorResponse = { success: false, message, ...(errors && { errors }) };
  return NextResponse.json(body, { status });
}
