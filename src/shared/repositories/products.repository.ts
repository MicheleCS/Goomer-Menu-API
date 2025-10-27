export interface IProductRepository {
  create(productData: CreateProductDto): Promise<Product>;
  findAll(): Promise<Product[]>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Product | null>;
  update(id: string, productData: UpdateProductDto): Promise<Product>;
  findActiveMenuProducts(): Promise<Product[]>;
}

import { Pool, QueryResult } from 'pg';
import { Product } from 'shared/database/entities/products.entity.js';
import { CreateProductDto } from 'shared/dtos/CreateProductDto.js';
import { UpdateProductDto } from 'shared/dtos/UpdateProductDto.js';

export class ProductRepository implements IProductRepository {
  private readonly pool: Pool;
  private readonly TABLE_NAME = 'products';

  constructor(pool: Pool) {
    this.pool = pool;
  }

  private mapRowToProduct(row: any): Product {
    return {
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
    } as Product;
  }

  async create(productData: CreateProductDto): Promise<Product> {
    const { name, price, category, visibility } = productData;

    const sql = `
        INSERT INTO ${this.TABLE_NAME} (name, price, category, visibility)
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
    `;

    const values = [name, price, category, visibility];

    const result: QueryResult = await this.pool.query(sql, values);

    if (result.rows.length === 0) {
      throw new Error('Falha ao criar o produto.');
    }

    return this.mapRowToProduct(result.rows[0]);
  }

  async findAll(): Promise<Product[]> {
    const sql = `SELECT * FROM ${this.TABLE_NAME} ORDER BY id ASC;`;

    const result: QueryResult = await this.pool.query(sql);

    return result.rows.map(this.mapRowToProduct);
  }

  async delete(id: string): Promise<void> {
    const sql = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1;`;

    await this.pool.query(sql, [id]);
  }

  async findById(id: string): Promise<Product | null> {
    const sql = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1;`;

    const result: QueryResult = await this.pool.query(sql, [id]);

    if (result.rows.length > 0) {
      return this.mapRowToProduct(result.rows[0]);
    }
    return null;
  }

  async update(
    id: string,
    productData: UpdateProductDto,
  ): Promise<Product | null> {
    const fields = Object.keys(productData);
    if (fields.length === 0) {
      return this.findById(id);
    }

    const setClauses = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ');
    const values = [id, ...fields.map((field) => (productData as any)[field])];

    const sql = `
      UPDATE ${this.TABLE_NAME}
      SET ${setClauses}
      WHERE id = $1
      RETURNING *;
    `;

    const result: QueryResult = await this.pool.query(sql, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToProduct(result.rows[0]);
  }

  async findActiveMenuProducts(): Promise<Product[]> {
    const sql = `
        SELECT 
        *
        FROM ${this.TABLE_NAME}
        WHERE visibility = TRUE
    `;
    const result: QueryResult = await this.pool.query(sql);
    return result.rows.map(this.mapRowToProduct);
  }
}
