import type { InvalidRequest } from "../types/lib.ts";

export class ApiError extends Error {
  response: InvalidRequest;

  constructor(response: InvalidRequest, message: string) {
    super(message);
    this.response = response;
  }
}
