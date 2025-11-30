import { pool } from "../../config/db.js";
import { insertVehicleQuery } from "../../queries/insertVehicleQuery.js";

export const vehicleService = {
  //
  //
  async getAllVehicles(Dealer_id: number) {
    const BASE_URL = process.env.BASE_URL;
    const res = await pool.query(`SELECT * FROM cars WHERE dealer_id =$1`, [
      Dealer_id,
    ]);

    const vehicles = res.rows.map((row) => {
      if (Array.isArray(row.images)) {
        row.images = row.images.map((img: string) => BASE_URL + img);
      }
      return row;
    });

    return vehicles;
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

  //update a car fields by dealer id and car id
  async updateCarByIdDealer(
    dealerId: number,
    carId: number,
    description: string,
    fuel: string,
    ac: boolean,
    year: number,
    mileage: number,
    status: string,
    badge: string,
    daily_rate: number
  ) {
    const isCarExist = await pool.query(`SELECT name FROM cars WHERE id = $1`, [
      carId,
    ]);

    console.log(
      "type of data",
      typeof description,
      typeof fuel,
      typeof ac,
      typeof year,
      typeof mileage,
      typeof status,
      typeof badge,
      typeof daily_rate
    );

    //update the car
    const updateRes = await pool.query(
      `UPDATE cars
SET 
  description = $1,
  fuel = $2,
  ac = $3,
  year = $4,
  mileage = $5,
  status = $6,
  badge = $7,
  daily_rate = $8,
  updated_at = NOW()
WHERE 
  id = $9
  AND dealer_id = $10
returning *
 
      `,
      [
        description,
        fuel,
        ac,
        year,
        mileage,
        status,
        badge,
        daily_rate,
        carId,
        dealerId,
      ]
    );

    if (!isCarExist.rows.length) {
      throw new Error("Invalid carId or dealerId");
    }

    return {
      updateRes: updateRes.rows[0],
    };
  },
};
