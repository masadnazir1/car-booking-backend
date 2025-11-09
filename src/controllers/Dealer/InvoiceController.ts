import { Request, Response } from "express";
import { InvoiceServ } from "../../services/dealer/invoiceService.js";

class DealerInvoice {
  constructor() {}

  async generateInvoice(req: Request, res: Response) {
    try {
      const { booking_id } = req.body;

      if (!booking_id) {
        return res.status(400).json({
          isExecutionSuccess: true,
          success: false,
          statusCode: 400,
          message: "Booking Id missing",
        });
      }

      const invoice = await InvoiceServ.generateInvoice(booking_id);

      res.status(200).json({
        isExecutionSuccess: true,
        success: true,
        statusCode: 200,
        message: "Invoice created successfully",
        data: invoice,
      });
    } catch (error: any) {
      console.error("Error in generateInvoice:", error);
      res.status(500).json({
        isExecutionSuccess: true,
        success: false,
        statusCode: 500,
        message: error.message || "Internal Server Error",
        data: null,
      });
    }
  }

  async getInvoice(req: Request, res: Response) {
    try {
      const { booking_id } = req.params;

      console.log("booking_id", booking_id);
      if (!booking_id) {
        return res.status(400).json({
          isExecutionSuccess: true,
          success: false,
          statusCode: 400,
          message: "Booking ID missing",
          data: null,
        });
      }

      const invoice = await InvoiceServ.getInvoice(Number(booking_id));

      if (!invoice) {
        return res.status(404).json({
          isExecutionSuccess: true,
          success: false,
          statusCode: 404,
          message: "Invoice not found",
          data: null,
        });
      }

      res.status(200).json({
        isExecutionSuccess: true,
        success: true,
        statusCode: 200,
        message: "Invoice retrieved successfully",
        data: invoice,
      });
    } catch (error: any) {
      console.error("Error in getInvoice:", error);
      res.status(500).json({
        isExecutionSuccess: false,
        success: false,
        statusCode: 500,
        message: error.message || "Internal Server Error",
        data: null,
      });
    }
  }
}

export default DealerInvoice;
