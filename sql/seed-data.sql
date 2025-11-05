-- Seeds Brands
INSERT INTO public.brands
(id, "name", slug, logo, country, description, founded_year, website, created_at, updated_at)
VALUES
(1, 'Toyota', 'toyota', 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_logo.png', 'Japan', 'Renowned for reliability and innovation in automotive manufacturing.', 1937, 'https://www.toyota.com', '2025-10-19 02:36:35.286', '2025-10-19 02:36:35.286'),
(2, 'Honda', 'honda', 'https://upload.wikimedia.org/wikipedia/commons/7/79/Honda_logo.svg', 'Japan', 'Manufacturer of automobiles, motorcycles, and power equipment.', 1948, 'https://www.honda.com', '2025-10-19 02:36:35.286', '2025-10-19 02:36:35.286'),
(3, 'BMW', 'bmw', 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg', 'Germany', 'Luxury vehicle brand known for performance and precision engineering.', 1916, 'https://www.bmw.com', '2025-10-19 02:36:35.286', '2025-10-19 02:36:35.286'),
(4, 'Mercedes-Benz', 'mercedes-benz', 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg', 'Germany', 'Luxury automotive brand focused on innovation, comfort, and design.', 1926, 'https://www.mercedes-benz.com', '2025-10-19 02:36:35.286', '2025-10-19 02:36:35.286'),
(5, 'Ford', 'ford', 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg', 'USA', 'One of the oldest automobile manufacturers in the world, known for mass production.', 1903, 'https://www.ford.com', '2025-10-19 02:36:35.286', '2025-10-19 02:36:35.286'),
(6, 'Hyundai', 'hyundai', 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Hyundai_logo.svg', 'South Korea', 'Global automotive manufacturer offering affordable and efficient vehicles.', 1967, 'https://www.hyundai.com', '2025-10-19 02:36:35.286', '2025-10-19 02:36:35.286'),
(7, 'Kia', 'kia', 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Kia_logo.svg', 'South Korea', 'Manufacturer of stylish and affordable vehicles with strong market growth.', 1944, 'https://www.kia.com', '2025-10-19 02:36:35.286', '2025-10-19 02:36:35.286'),
(8, 'Nissan', 'nissan', 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Nissan_2020_logo.svg', 'Japan', 'Innovative car manufacturer with a wide range of vehicles and EV technology.', 1933, 'https://www.nissan-global.com', '2025-10-19 02:36:35.286', '2025-10-19 02:36:35.286'),
(9, 'Audi', 'audi', 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Audi_logo_detail.svg', 'Germany', 'Luxury car brand recognized for technology, design, and performance.', 1909, 'https://www.audi.com', '2025-10-19 02:36:35.286', '2025-10-19 02:36:35.286'),
(10, 'Chevrolet', 'chevrolet', 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Chevrolet_logo.svg', 'USA', 'American automobile brand offering a wide variety of cars and trucks.', 1911, 'https://www.chevrolet.com', '2025-10-19 02:36:35.286', '2025-10-19 02:36:35.286');


-- Categories


INSERT INTO public.categories
(id, "name", description, created_at, updated_at)
VALUES
(1, 'Sedan', 'Passenger cars with a three-box configuration offering comfort and fuel efficiency.', '2025-10-19 02:37:07.540', '2025-10-19 02:37:07.540'),
(2, 'SUV', 'Sport Utility Vehicles designed for versatility, off-road capability, and spacious interiors.', '2025-10-19 02:37:07.540', '2025-10-19 02:37:07.540'),
(3, 'Hatchback', 'Compact cars with a rear door that swings upward, providing convenient cargo access.', '2025-10-19 02:37:07.540', '2025-10-19 02:37:07.540'),
(4, 'Coupe', 'Two-door sporty cars focused on performance and sleek design.', '2025-10-19 02:37:07.540', '2025-10-19 02:37:07.540'),
(5, 'Convertible', 'Cars with retractable roofs, allowing open-air driving experiences.', '2025-10-19 02:37:07.540', '2025-10-19 02:37:07.540'),
(6, 'Pickup Truck', 'Vehicles with open cargo areas designed for hauling and towing.', '2025-10-19 02:37:07.540', '2025-10-19 02:37:07.540'),
(7, 'Van', 'Large vehicles ideal for transporting people or goods with ample storage capacity.', '2025-10-19 02:37:07.540', '2025-10-19 02:37:07.540'),
(8, 'Crossover', 'Cars combining SUV features with a unibody platform for better comfort and fuel economy.', '2025-10-19 02:37:07.540', '2025-10-19 02:37:07.540'),
(9, 'Electric', 'Vehicles powered entirely by electric motors and rechargeable batteries.', '2025-10-19 02:37:07.540', '2025-10-19 02:37:07.540'),
(10, 'Hybrid', 'Cars combining internal combustion engines with electric propulsion for improved efficiency.', '2025-10-19 02:37:07.540', '2025-10-19 02:37:07.540');
