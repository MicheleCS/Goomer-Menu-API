interface IProductRepository {
  create(data: Omit<IProduct, 'id'>): Promise<IProduct>;
  findAll(): Promise<IProduct[]>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<IProduct | null>;
}

import { Pool, PoolClient, QueryResult } from 'pg';
import { IProduct } from '../database/entities/products.entity';

export class ProductRepository implements IProductRepository {
  private readonly pool: Pool;
  private readonly TABLE_NAME = 'products';

  constructor(pool: Pool) {
      this.pool = pool;
  }

  private mapRowToProduct(row: any): IProduct {
      return {
          id: row.id,
          name: row.name,
          price: parseFloat(row.price),
      } as IProduct;
  }

  async create(data: Omit<IProduct, 'id'>): Promise<IProduct> {
      const { name, price } = data;
      
      const sql = `
          INSERT INTO ${this.TABLE_NAME} (name, price)
          VALUES ($1, $2)
          RETURNING *;
      `;
      
      const values = [name, price];

      const result: QueryResult = await this.pool.query(sql, values);
      
      if (result.rows.length === 0) {
          throw new Error('Falha ao criar o produto.');
      }

      return this.mapRowToProduct(result.rows[0]); 
  }

  async findAll(): Promise<IProduct[]> {
      const sql = `SELECT * FROM ${this.TABLE_NAME} ORDER BY id ASC;`;

      const result: QueryResult = await this.pool.query(sql);

      return result.rows.map(this.mapRowToProduct);
  }
  
  async delete(id: number): Promise<void> {
      const sql = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1;`;
      
      await this.pool.query(sql, [id]);
  }

  async findById(id: number): Promise<IProduct | null> {
      const sql = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1;`;
      
      const result: QueryResult = await this.pool.query(sql, [id]);

      if (result.rows.length > 0) {
          return this.mapRowToProduct(result.rows[0]);
      }
      return null;
  }
}