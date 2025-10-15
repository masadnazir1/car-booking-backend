export const insertVehicleQuery = `
  INSERT INTO cars (
    dealer_id,
    brand_id,
    category_id,
    name,
    description,
    images,
    badge,
    seats,
    doors,
    transmission,
    fuel,
    daily_rate,
    status,
    location,
    ac,
    year,
    mileage
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
    $11, $12, $13, $14, $15, $16, $17
  )
  RETURNING id, created_at;
`;
