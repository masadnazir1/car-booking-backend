export class ResponseHandler {
    static success(res, data, message = "Success") {
        return res.status(200).json({ status: "success", message, data });
    }
    static error(res, message = "Something went wrong", code = 500) {
        return res.status(code).json({ status: "error", message });
    }
}
