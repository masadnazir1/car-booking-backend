import { pool } from "../config/db.js";

const categories = [
  {
    name: "Sedan",
    description:
      "Compact and comfortable four-door cars suitable for city and highway.",
  },
  {
    name: "Hatchback",
    description:
      "Small cars with rear door that opens upwards, ideal for urban use.",
  },
  {
    name: "SUV",
    description:
      "Sport Utility Vehicles, larger size, often 4WD, good for families and rough terrain.",
  },
  {
    name: "Crossover",
    description:
      "A smaller SUV built on car platform, combining features of hatchback and SUV.",
  },
  {
    name: "Pickup Truck",
    description:
      "Light trucks for carrying cargo, often used commercially or for off-road.",
  },
  {
    name: "Van/Minivan",
    description:
      "Multi-purpose vans for family or business use, spacious interior.",
  },
  {
    name: "Luxury Sedan",
    description: "High-end sedans offering premium comfort and features.",
  },
  {
    name: "Sports Car",
    description: "High-performance cars built for speed and handling.",
  },
  {
    name: "Convertible",
    description: "Cars with retractable roof for open-air driving.",
  },
  {
    name: "Electric Vehicle",
    description:
      "Battery-powered cars with zero emissions, increasingly available in Pakistan.",
  },
  {
    name: "Hybrid",
    description:
      "Cars using both petrol/diesel engine and electric motor for fuel efficiency.",
  },
  {
    name: "CNG Vehicle",
    description:
      "Cars running on compressed natural gas, common in Pakistan for lower fuel costs.",
  },
  {
    name: "Microbus",
    description: "Larger passenger vans used for public or private transport.",
  },
  {
    name: "Rickshaw/Auto",
    description: "Three-wheeled vehicles used for short-distance transport.",
  },
];

export async function seedCategories() {
  for (const cat of categories) {
    await pool.query(
      `INSERT INTO categories (name, description) 
       VALUES ($1, $2) 
       ON CONFLICT (name) DO NOTHING`,
      [cat.name, cat.description]
    );
  }
  console.log("Categories seeding completed.");
}
