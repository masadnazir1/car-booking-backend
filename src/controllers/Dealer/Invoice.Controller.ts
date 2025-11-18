import { Request, Response } from "express";
import CONSTANTS from "../../constants/consts.js";
import { InvoiceServ } from "../../services/dealer/invoice.Service.js";
import API_RES from "../../utils/resHandlers.ts/ApiRes.js";

class DealerInvoice {
  ERR_MSG = CONSTANTS.API_ERRORS.INTERNAL_SERVER_MSG;
  SERVER_ERR = CONSTANTS.API_ERRORS.INTERNAL_SERVER_ERR;

  constructor() {}

  generateInvoice = async (req: Request, res: Response) => {
    const { booking_id } = req?.body;

    try {
      throw new Error("Asad ke wajha sy ye error aya ha");
      if (!booking_id) {
        return res
          .status(400)
          .json(
            new API_RES(true, 400, "Required fields missing", null, [
              "Booking Id missing",
            ])
          );
      }

      const [invoice, error] = await InvoiceServ.generateInvoice(booking_id);

      if (!invoice)
        return res
          .status(404)
          .json(
            new API_RES(true, 404, error, null, [
              `${error} with id ${booking_id}`,
            ])
          );
      res
        .status(201)
        .json(
          new API_RES(true, 201, "Invoice created successfully", invoice, [])
        );
    } catch (error: any) {
      res
        .status(500)
        .json(
          new API_RES(
            false,
            500,
            this.ERR_MSG,
            null,
            [this.SERVER_ERR],
            error,
            req
          )
        );
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

      const [invoice, error] = await InvoiceServ.getInvoice(Number(booking_id));

      if (!invoice) {
        return res
          .status(404)
          .json(new API_RES(true, 404, error, null, ["Invoice not found"]));
      }

      res
        .status(201)
        .json(
          new API_RES(true, 201, "Invoice retrieved successfully", invoice, [])
        );
    } catch (error: any) {
      res
        .status(500)
        .json(
          new API_RES(
            false,
            500,
            this.ERR_MSG,
            null,
            [this.SERVER_ERR],
            error,
            req
          )
        );
    }
  };
}

export default DealerInvoice;
