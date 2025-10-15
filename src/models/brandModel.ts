import { pool } from "../config/db.js";
import { Brand } from "../Interfaces/BrandI";

export const BrandModel = {
  // ===============================
  // Create Brand
  // ===============================
  async create(
    data: Omit<Brand, "id" | "created_at" | "updated_at">
  ): Promise<Brand> {
    const query = `
      INSERT INTO brands (name, slug, logo, country, description, founded_year, website)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      data.name,
      data.slug,
      data.logo || null,
      data.country || null,
      data.description || null,
      data.founded_year || null,
      data.website || null,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // ===============================
  // Get All Brands
  // ===============================
  async getAll(): Promise<Brand[]> {
    const query = `SELECT * FROM brands ORDER BY name ASC;`;
    const { rows } = await pool.query(query);
    return rows;
  },

  async getLocation(location?: string): Promise<Brand[]> {
    if (location && location.trim()) {
      // Get distinct brand IDs of cars in the given location
      const brandResult = await pool.query(
        `SELECT DISTINCT brand_id 
       FROM cars 
       WHERE location ILIKE $1;`,
        [`%${location.trim()}%`]
      );

      const brandIds = brandResult.rows.map((row) => row.brand_id);

      if (brandIds.length === 0) return []; // No brands found

      // Fetch brands by these IDs
      const result = await pool.query(
        `SELECT * FROM brands WHERE id = ANY($1::int[]) ORDER BY name ASC;`,
        [brandIds]
      );

      return result.rows;
    } else {
      // No location filter → return all brands
      const result = await pool.query(
        `SELECT * FROM brands ORDER BY name ASC;`
      );
      return result.rows;
    }
  },

  // ===============================
  // Get Brand by ID
  // ===============================
  async getById(id: number): Promise<Brand | null> {
    const query = `SELECT * FROM brands WHERE id = $1;`;
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  },

  // ===============================
  // Get Brand by Slug
  // ===============================
  async getBySlug(slug: string): Promise<Brand | null> {
    const query = `SELECT * FROM brands WHERE slug = $1;`;
    const { rows } = await pool.query(query, [slug]);
    return rows[0] || null;
  },

  // ===============================
  // Update Brand
  // ===============================
  async update(id: number, data: Partial<Brand>): Promise<Brand | null> {
    const fields = Object.keys(data);
    if (fields.length === 0) return null;

    const setClause = fields.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const values = fields.map((key) => (data as any)[key]);

    const query = `
      UPDATE brands
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [id, ...values]);
    return rows[0] || null;
  },

  // ===============================
  // Delete Brand
  // ===============================
  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM brands WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
