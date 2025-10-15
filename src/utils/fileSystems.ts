import fs from "fs";
import path from "path";

export const fileSystems = {
  // Create folders for Business and Brand
  async BusinessNameFolder(businessName: string, brand: string) {
    try {
      // Base folder for all dealers
      const baseFolder = path.join(process.cwd(), "DealersData");

      // Ensure base folder exists
      if (!fs.existsSync(baseFolder)) {
        fs.mkdirSync(baseFolder, { recursive: true });
        console.log("Base folder created:", baseFolder);
      }

      // Create Business folder
      const businessFolder = path.join(baseFolder, businessName);
      if (!fs.existsSync(businessFolder)) {
        fs.mkdirSync(businessFolder, { recursive: true });
        console.log("Business folder created:", businessFolder);
      } else {
        console.log("Business folder already exists:", businessFolder);
      }

      // Create Brand folder
      const brandFolder = path.join(businessFolder, brand);
      if (!fs.existsSync(brandFolder)) {
        fs.mkdirSync(brandFolder, { recursive: true });
        console.log("Brand folder created:", brandFolder);
      } else {
        console.log("Brand folder already exists:", brandFolder);
      }

      return brandFolder; // return path for further use
    } catch (error) {
      console.error("Error creating business/brand folder:", error);
      throw error;
    }
  },

  // Create folder for a specific car under a brand
  async createCarVehicleFolder(
    businessName: string,
    brand: string,
    carName: string
  ) {
    try {
      // Get the brand folder path first
      const brandFolderPath = path.join(
        process.cwd(),
        "DealersData",
        businessName,
        brand
      );

      // Ensure brand folder exists (otherwise create it)
      if (!fs.existsSync(brandFolderPath)) {
        fs.mkdirSync(brandFolderPath, { recursive: true });
        console.log("Brand folder created for car:", brandFolderPath);
      }

      // Create car folder under brand
      const carFolderPath = path.join(brandFolderPath, carName);

      if (!fs.existsSync(carFolderPath)) {
        fs.mkdirSync(carFolderPath, { recursive: true });
        console.log("Car folder created:", carFolderPath);
      } else {
        console.log("Car folder already exists:", carFolderPath);
      }

      return carFolderPath;
    } catch (error) {
      console.error("Error creating car folder:", error);
      throw error;
    }
  },
};
