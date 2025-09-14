export class ResponseHandler {
  static success(res: any, data: any, message = "Success") {
    return res.status(200).json({ status: "success", message, data });
  }

  static error(res: any, message = "Something went wrong", code = 500) {
    return res.status(code).json({ status: "error", message });
  }
}
