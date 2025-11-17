import { Request } from "express";
import fs from "fs";
import path from "path";
/**
 * @class API_RES
 * @todo Add log rotation and cleanup mechanism
 * @author Ahmed Mujtaba
 */

class API_RES {
  // private variables
  private req?: Request;
  private stack?: stack;

  // exposed variables
  isExecutionSuccess: boolean;
  statusCode: number;
  message: string;
  data: [] | null | undefined;
  errors: string[];
  success: boolean;

  // ============================================================================
  // CONSTRUCTOR
  // ============================================================================

  /**
   * Creates a new standardized API response
   *
   * @param {boolean} isExecutionSuccess - Server-side execution status (default: true)
   *   TRUE: Server processed request without internal errors
   *   FALSE: Server encountered internal errors (DB errors, exceptions, etc.)
   *
   * @param {number} statusCode - HTTP status code (200, 201, 400, 404, 500, etc.)
   *
   * @param {string} message - User-friendly message describing the response
   *
   * @param {any} data - Response payload data (array, object, or null)
   *
   * @param {string[]} errors - Array of error messages for client (empty for success)
   *
   * @param {string} [stack] - Optional error stack trace for internal logging
   *   If provided, triggers error reporting and logging mechanism
   *   NEVER exposed to the client
   *
   * @param {Request} [req] - Optional Express request object for detailed logging
   *   Contains headers, body, params, query, IP, user-agent, etc.
   *   Used only for internal error tracking
   */
  constructor(
    isExecutionSuccess: boolean = true,
    statusCode: number,
    message: string,
    data: [] | null | undefined,
    errors: string[],
    stack?: stack,
    req?: Request
  ) {
    this.isExecutionSuccess = isExecutionSuccess;
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.errors = errors;
    this.data = data;
    this.req = req;

    if (stack) {
      stack
        ? (this.stack = stack)
        : Error.captureStackTrace(this, this.constructor);
      this.reportError();
    }
  }

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  /**
   * Serializes the response for client consumption
   *
   * This method is automatically invoked by Express's res.json() when serializing
   * the response object. It ensures that sensitive information is never exposed
   * to the client by excluding private properties.
   *
   * SECURITY FEATURES:
   * - Removes stack traces to prevent information disclosure
   * - Removes request details to protect sensitive data
   * - Eliminates circular references (req.socket → socket.parser → parser.socket)
   * - Returns only client-safe properties
   *
   * @returns {Object} Sanitized response object safe for client consumption
   *
   * @example
   * const response = new API_RES(true, 200, "Success", data, []);
   * res.json(response); // toJSON() is automatically called
   */

  toJSON() {
    return {
      isExecutionSuccess: this.isExecutionSuccess,
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      data: this.data,
      errors: this.errors,
    };
  }

  private reportError() {
    try {
      const logsDir = path.join(process.cwd(), "logs");
      if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

      const timestamp = new Date().toISOString();
      const date = timestamp.split("T")[0];
      const logFile = path.join(logsDir, `error-${date}.log`);

      const errorLog = `
        ${"=".repeat(80)}
        ${"=".repeat(80)}
        SERVER ERROR OCCURRED
        ${"=".repeat(80)}
        ${"=".repeat(80)}

        Error Occured At: ${timestamp},
        Status Code: ${this.statusCode},
        Url: ${this.req?.originalUrl},
        Method: ${this.req?.method},
        Request Body: ${JSON.stringify(this.req?.body)},
        Params: ${JSON.stringify(this.req?.params)},
        Query: ${JSON.stringify(this.req?.query)},
        Ip: ${this.req?.ip},
        User Agent: ${this.req?.get("user-agent")},
        Request Headers : ${JSON.stringify(this.req?.headers)}

        Stack: ${JSON.stringify(this.stack?.stack)}
 
      `;
      fs.appendFileSync(logFile, errorLog);
    } catch (e) {
      console.log("Error occured while logging error", e);
    }
  }
}

export default API_RES;

interface stack {
  message: string;
  stack: string;
}
