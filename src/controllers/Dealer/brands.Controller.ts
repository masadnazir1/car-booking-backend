import { Request, Response } from "express";
import API_RES from "../../utils/resHandlers.ts/ApiRes.js";
import { BrandsSservice } from "../../services/dealer/Brands.service.js";
import CONSTANTS from "../../constants/consts.js";

class Brands {
  ERR_MSG = CONSTANTS.API_ERRORS.INTERNAL_SERVER_MSG;
  SERVER_ERR = CONSTANTS.API_ERRORS.INTERNAL_SERVER_ERR;

  constructor() {}

  getBrands = async (req: Request, res: Response) => {
    try {
      const allBrands: any = await BrandsSservice.getAll();

      res
        .status(200)
        .json(
          new API_RES(true, 200, "Brands success successfully", allBrands, [])
        );
    } catch (error: any) {
      console.error("Error in getting Brands:", error);
      res
        .status(500)
        .json(new API_RES(false, 500, this.ERR_MSG, null, [this.SERVER_ERR]));
    }
  };
}

export default Brands;
