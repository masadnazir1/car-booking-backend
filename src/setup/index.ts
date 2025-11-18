import { seedBrands } from "./seedBrands.js";
import { seedCategories } from "./seedCategories.js";

export async function runSetup() {
  console.log("Starting initial setup...");
  await seedCategories();
  await seedBrands();
  console.log("Setup completed.");
}
