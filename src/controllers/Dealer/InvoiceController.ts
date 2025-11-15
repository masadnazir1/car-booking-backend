import { Request, Response } from "express";
import { InvoiceServ } from "../../services/dealer/invoiceService.js";
import API_RES from "../../utils/resHandlers.ts/ApiRes.js";
import CONSTANTS from "../../constants/consts.js";

class DealerInvoice {
  ERR_MSG = CONSTANTS.API_ERRORS.INTERNAL_SERVER_MSG;
  SERVER_ERR = CONSTANTS.API_ERRORS.INTERNAL_SERVER_ERR;

  constructor() {}

  generateInvoice = async (req: Request, res: Response) => {
    try {
      const { booking_id } = req.body;

      if (!booking_id) {
        return res
          .status(400)
          .json(
            new API_RES(true, 400, "Required fields missing", null, [
              "Booking Id missing",
            ])
          );
      }

      const invoice = await InvoiceServ.generateInvoice(booking_id);

      res
        .status(201)
        .json(
          new API_RES(true, 201, "Invoice created successfully", invoice, [])
        );
    } catch (error: any) {
      console.error("Error in generateInvoice:", error);
      res
        .status(500)
        .json(new API_RES(false, 500, this.ERR_MSG, null, [this.SERVER_ERR]));
    }
  };

  getInvoice = async (req: Request, res: Response) => {
    const { booking_id } = req.params;
    try {
      if (!booking_id)
        return res
          .status(400)
          .json(
            new API_RES(true, 400, "Required fields missing", null, [
              "Booking Id missing",
            ])
          );

      const invoice = await InvoiceServ.getInvoice(Number(booking_id));

      if (!invoice) {
        return res
          .status(404)
          .json(
            new API_RES(true, 404, "Invoice Not Found", null, [
              "Invoice not found",
            ])
          );
      }

      res
        .status(201)
        .json(
          new API_RES(true, 201, "Invoice retrieved successfully", invoice, [])
        );
    } catch (error: any) {
      console.error("Error in getInvoice:", error);
      res
        .status(500)
        .json(new API_RES(false, 500, this.ERR_MSG, null, [this.SERVER_ERR]));
    }
  };
}

export default DealerInvoice;
