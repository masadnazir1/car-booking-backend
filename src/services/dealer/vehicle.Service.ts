import { pool } from "../../config/db.js";
import { insertVehicleQuery } from "../../queries/insertVehicleQuery.js";

export const vehicleService = {
  async getAllVehicles(Dealer_id: number) {
    const res = await pool.query(`SELECT * FROM cars WHERE dealer_id =$1`, [
      Dealer_id,
    ]);
    console.log("Dealer_id", res.rows);
    return res.rows;
  },

  //Method to add a car
  async addVehicle(dataPayload: any) {
    const result = await pool.query(insertVehicleQuery, [
      dataPayload.dealer_id,
      dataPayload.brand_id,
      dataPayload.category_id,
      dataPayload.name,
      dataPayload.description,
      dataPayload.images,
      dataPayload.badge,
      dataPayload.seats,
      dataPayload.doors,
      dataPayload.transmission,
      dataPayload.fuel,
      dataPayload.daily_rate,
      dataPayload.status,
      dataPayload.location,
      dataPayload.ac,
      dataPayload.year,
      dataPayload.mileage,
    ]);

    return {
      success: true,
      message: "Vehicle added successfully",
      vehicle_id: result.rows[0].id,
      created_at: result.rows[0].created_at,
    };
  },

  async getDealerAndBrand(Dealer_id: number, brand_id: number) {
    const brandRes = await pool.query(`SELECT name FROM brands WHERE id = $1`, [
      brand_id,
    ]);
    const dealerRes = await pool.query(
      `SELECT business_name FROM dealer_businesses WHERE user_id = $1`,
      [Dealer_id]
    );

    if (!brandRes.rows.length || !dealerRes.rows.length) {
      throw new Error("Invalid dealer or brand ID");
    }

    return {
      brandName: brandRes.rows[0].name,
      businessName: dealerRes.rows[0].business_name,
    };
  },
};
