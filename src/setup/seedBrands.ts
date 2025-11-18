import { pool } from "../config/db.js";

const brands = [
  {
    name: "Toyota",
    slug: "toyota",
    logo: "",
    country: "Japan",
    description: "Japanese automobile manufacturer known for reliability.",
    founded_year: 1937,
    website: "https://www.toyota.com/",
  },
  {
    name: "Honda",
    slug: "honda",
    logo: "",
    country: "Japan",
    description:
      "Japanese brand producing cars, motorcycles, and power equipment.",
    founded_year: 1948,
    website: "https://www.honda.com/",
  },
  {
    name: "Suzuki",
    slug: "suzuki",
    logo: "",
    country: "Japan",
    description: "Popular Japanese brand for cars and motorcycles.",
    founded_year: 1909,
    website: "https://www.globalsuzuki.com/",
  },
  {
    name: "Kia",
    slug: "kia",
    logo: "",
    country: "South Korea",
    description:
      "South Korean automobile manufacturer, entering Pakistan with modern vehicles.",
    founded_year: 1944,
    website: "https://www.kia.com/",
  },
  {
    name: "Hyundai",
    slug: "hyundai",
    logo: "",
    country: "South Korea",
    description:
      "South Korean car brand, known for reliability and affordability.",
    founded_year: 1967,
    website: "https://www.hyundai.com/",
  },
  {
    name: "Nissan",
    slug: "nissan",
    logo: "",
    country: "Japan",
    description: "Japanese car manufacturer with a global presence.",
    founded_year: 1933,
    website: "https://www.nissan-global.com/",
  },
  {
    name: "Mercedes-Benz",
    slug: "mercedes-benz",
    logo: "",
    country: "Germany",
    description: "Luxury German automobile brand.",
    founded_year: 1926,
    website: "https://www.mercedes-benz.com/",
  },
  {
    name: "BMW",
    slug: "bmw",
    logo: "",
    country: "Germany",
    description: "German luxury and performance cars.",
    founded_year: 1916,
    website: "https://www.bmw.com/",
  },
  {
    name: "Audi",
    slug: "audi",
    logo: "",
    country: "Germany",
    description: "Premium German cars combining performance and technology.",
    founded_year: 1909,
    website: "https://www.audi.com/",
  },
  {
    name: "Ford",
    slug: "ford",
    logo: "",
    country: "USA",
    description: "American car brand with trucks, SUVs, and sedans.",
    founded_year: 1903,
    website: "https://www.ford.com/",
  },
  {
    name: "Chevrolet",
    slug: "chevrolet",
    logo: "",
    country: "USA",
    description:
      "American cars and trucks, known for performance and durability.",
    founded_year: 1911,
    website: "https://www.chevrolet.com/",
  },
  {
    name: "Daihatsu",
    slug: "daihatsu",
    logo: "",
    country: "Japan",
    description: "Japanese brand specializing in small cars and SUVs.",
    founded_year: 1907,
    website: "https://www.daihatsu.com/",
  },
  {
    name: "MG",
    slug: "mg",
    logo: "",
    country: "UK/China",
    description:
      "British automotive brand now owned by Chinese company SAIC, producing modern SUVs and sedans.",
    founded_year: 1924,
    website: "https://www.mgmotor.co.uk/",
  },
  {
    name: "Changan",
    slug: "changan",
    logo: "",
    country: "China",
    description: "Chinese brand entering Pakistan with affordable cars.",
    founded_year: 1862,
    website: "https://www.changan.com/",
  },
  {
    name: "FAW",
    slug: "faw",
    logo: "",
    country: "China",
    description: "Chinese manufacturer of cars and commercial vehicles.",
    founded_year: 1953,
    website: "http://www.faw.com/",
  },
];

export async function seedBrands() {
  for (const brand of brands) {
    await pool.query(
      `INSERT INTO brands (name, slug, logo, country, description, founded_year, website)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (name) DO NOTHING`,
      [
        brand.name,
        brand.slug,
        brand.logo,
        brand.country,
        brand.description,
        brand.founded_year,
        brand.website,
      ]
    );
  }
  console.log("Brands seeding completed.");
}
