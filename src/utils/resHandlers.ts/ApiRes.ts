import { Request } from "express";
class API_RES {
  isExecutionSuccess: boolean;
  statusCode: number;
  message: string;
  data: [] | null | undefined;
  errors: string[];
  private stack?: string;
  success: boolean;
  req?: Request;
  constructor(
    isExecutionSuccess: boolean = true,
    statusCode: number,
    message: string,
    data: [] | null | undefined,
    errors: string[],
    stack?: string,
    req?: Request
  ) {
    this.isExecutionSuccess = isExecutionSuccess;
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.errors = errors;
    this.data = data;

    if (stack) {
      stack
        ? (this.stack = stack)
        : Error.captureStackTrace(this, this.constructor);
      this.reportError();
    }
  }
  reportError() {
    console.log("Report Error invoked");
  }
}

export default API_RES;
