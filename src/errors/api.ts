import { InvalidRequest } from "../types/lib.ts";

export class ApiError extends Error {
  constructor(public response: InvalidRequest, message: string) {
    super(message);
  }
}
