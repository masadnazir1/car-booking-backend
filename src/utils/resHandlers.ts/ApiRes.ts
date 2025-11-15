class API_RES {
  isExecutionSuccess: boolean;
  statusCode: number;
  message: string;
  data: [] | null | undefined;
  errors: string[];
  stack?: string;
  success: boolean;
  constructor(
    isExecutionSuccess: boolean = true,
    statusCode: number,
    message: string,
    data: [] | null | undefined,
    errors: string[],
    stack?: string
  ) {
    this.isExecutionSuccess = isExecutionSuccess;
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = data;
    this.errors = errors;
    stack
      ? (this.stack = stack)
      : Error.captureStackTrace(this, this.constructor);
  }
}

export default API_RES;
