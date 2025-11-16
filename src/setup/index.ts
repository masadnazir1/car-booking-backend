import { seedBrands } from "./seedBrands";
import { seedCategories } from "./seedCategories";

export async function runSetup() {
  console.log("Starting initial setup...");
  await seedCategories();
  await seedBrands();
  console.log("Setup completed.");
}
