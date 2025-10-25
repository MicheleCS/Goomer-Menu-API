import { Pool, QueryResult } from 'pg';
import { DayOfWeek } from '../enums/dayOfWeek';
import { Promotion } from '@shared/database/entities/promotions.entity';

type CreatePromotionData = Omit<Promotion, 'id'>;

export interface IPromotionRepository {
  create(data: CreatePromotionData): Promise<Promotion>;
  findAll(): Promise<Promotion[]>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Promotion | null>;
  findActiveByProductId(productId: string): Promise<Promotion[]>;
}

export class PromotionRepository implements IPromotionRepository {
  private readonly pool: Pool;
  private readonly TABLE_NAME = 'promotions';

  constructor(pool: Pool) {
    this.pool = pool;
  }

  private mapRowToPromotion(row: any): Promotion {
    return {
      id: row.id,
      productId: row.product_id,
      description: row.description,
      promotionalPrice: parseFloat(row.promotional_price),
      daysOfWeek: row.days_of_week as DayOfWeek[],
      startTime: row.start_time,
      endTime: row.end_time,
      visibility: row.visibility,
    } as Promotion;
  }

  async create(data: CreatePromotionData): Promise<Promotion> {
    const {
      productId,
      description,
      promotionalPrice,
      daysOfWeek,
      startTime,
      endTime,
      visibility,
    } = data;

    const sql = `
            INSERT INTO ${this.TABLE_NAME} (
                product_id, description, promotional_price, 
                days_of_week, start_time, end_time, visibility
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

    const values = [
      productId,
      description,
      promotionalPrice,
      daysOfWeek,
      startTime,
      endTime,
      visibility,
    ];

    const result: QueryResult = await this.pool.query(sql, values);

    if (result.rows.length === 0) {
      throw new Error('Falha ao criar a promoção no banco de dados.');
    }

    return this.mapRowToPromotion(result.rows[0]);
  }

  async findAll(): Promise<Promotion[]> {
    const sql = `SELECT * FROM ${this.TABLE_NAME} ORDER BY product_id ASC;`;

    const result: QueryResult = await this.pool.query(sql);

    return result.rows.map(this.mapRowToPromotion);
  }

  async delete(id: string): Promise<void> {
    const sql = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1;`;

    const result: QueryResult = await this.pool.query(sql, [id]);

    if (result.rowCount === 0) {
      throw new Error(`Promoção com ID ${id} não encontrada para exclusão.`);
    }
  }

  async findById(id: string): Promise<Promotion | null> {
    const sql = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1;`;

    const result: QueryResult = await this.pool.query(sql, [id]);

    if (result.rows.length > 0) {
      return this.mapRowToPromotion(result.rows[0]);
    }

    return null;
  }
  async findActiveByProductId(productId: string): Promise<Promotion[]> {
    const sql = `
            SELECT * FROM ${this.TABLE_NAME}
            WHERE product_id = $1 AND visibility = TRUE;
        `;

    const result: QueryResult = await this.pool.query(sql, [productId]);

    return result.rows.map(this.mapRowToPromotion);
  }
}
