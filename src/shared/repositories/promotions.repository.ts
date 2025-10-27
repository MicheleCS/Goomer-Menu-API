import { Pool, QueryResult } from 'pg';
import { Promotion } from 'shared/database/entities/promotions.entity.js';
import { DayOfWeek } from 'shared/enums/dayOfWeek.js';
import { CreatePromotionDto } from 'shared/dtos/CreatePromotionDto.js';
import { UpdatePromotionDto } from 'shared/dtos/UpdatePromotionDto.js';

export interface IPromotionRepository {
  create(data: CreatePromotionDto): Promise<Promotion>;
  findAll(): Promise<Promotion[]>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Promotion | null>;
  update(id: string, data: UpdatePromotionDto): Promise<Promotion | null>;
  findActiveMenuPromotions(
    currentDay: DayOfWeek,
    currentTime: string,
  ): Promise<Promotion[]>;
}

export class PromotionRepository implements IPromotionRepository {
  private readonly pool: Pool;
  private readonly TABLE_NAME = 'promotions';

  constructor(pool: Pool) {
    this.pool = pool;
  }

  private readonly PROMOTION_COLUMNS =
    'id, product_id AS "productId", description, promotional_price AS "promotionalPrice", days_of_week AS "daysOfWeek", start_time AS "startTime", end_time AS "endTime"';

  private mapRowToPromotion(row: any): Promotion {
    const daysOfWeekValue =
      typeof row.daysOfWeek === 'string'
        ? JSON.parse(row.daysOfWeek)
        : row.daysOfWeek;

    return {
      id: row.id,
      productId: row.productId,
      description: row.description,
      promotionalPrice: parseFloat(row.promotionalPrice),
      daysOfWeek: daysOfWeekValue as DayOfWeek[],
      startTime: row.startTime,
      endTime: row.endTime,
    } as Promotion;
  }

  async create(data: CreatePromotionDto): Promise<Promotion> {
    const {
      productId,
      description,
      promotionalPrice,
      daysOfWeek,
      startTime,
      endTime,
    } = data;

    const sql = `
            INSERT INTO ${this.TABLE_NAME} (
                product_id, description, promotional_price, 
                days_of_week, start_time, end_time
                )
            VALUES ($1, $2, $3, $4, $5, $6) -- CORREÇÃO: Removido o $7 (para 6 colunas)
            RETURNING ${this.PROMOTION_COLUMNS}; 
        `;

    const values = [
      productId,
      description,
      promotionalPrice,
      JSON.stringify(daysOfWeek),
      startTime,
      endTime,
    ];

    const result: QueryResult = await this.pool.query(sql, values);

    if (result.rows.length === 0) {
      throw new Error('Falha ao criar a promoção no banco de dados.');
    }

    return this.mapRowToPromotion(result.rows[0]);
  }

  async update(
    id: string,
    data: UpdatePromotionDto,
  ): Promise<Promotion | null> {
    const fields = Object.keys(data).filter((key) => key !== 'id');

    if (fields.length === 0) {
      return this.findById(id);
    }
    const snakeCaseFields = {
      productId: 'product_id',
      promotionalPrice: 'promotional_price',
      daysOfWeek: 'days_of_week',
      startTime: 'start_time',
      endTime: 'end_time',
    };

    const setClauses = fields
      .map((field, index) => {
        const dbField = (snakeCaseFields as any)[field] || field;
        return `${dbField} = $${index + 2}`;
      })
      .join(', ');

    const values = [
      id,
      ...fields.map((field) =>
        field === 'daysOfWeek'
          ? JSON.stringify((data as any)[field])
          : (data as any)[field],
      ),
    ];

    const sql = `
      UPDATE ${this.TABLE_NAME}
      SET ${setClauses}
      WHERE id = $1
      RETURNING ${this.PROMOTION_COLUMNS};
    `;

    const result: QueryResult = await this.pool.query(sql, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToPromotion(result.rows[0]);
  }

  async findAll(): Promise<Promotion[]> {
    const sql = `SELECT ${this.PROMOTION_COLUMNS} FROM ${this.TABLE_NAME} ORDER BY product_id ASC;`;
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
    const sql = `SELECT ${this.PROMOTION_COLUMNS} FROM ${this.TABLE_NAME} WHERE id = $1;`;
    const result: QueryResult = await this.pool.query(sql, [id]);
    if (result.rows.length > 0) {
      return this.mapRowToPromotion(result.rows[0]);
    }
    return null;
  }

  async findActiveMenuPromotions(
    currentDay: DayOfWeek,
    currentTime: string,
  ): Promise<Promotion[]> {
    const promotionCols = this.PROMOTION_COLUMNS.split(',')
      .map((col) => `t1.${col.trim()}`)
      .join(', ');

    const sql = `
      SELECT 
          ${promotionCols},  
          t2.price AS "productPrice", 
          t2.name AS "productName" 
      FROM ${this.TABLE_NAME} t1
      INNER JOIN products t2 ON t1.product_id = t2.id
      WHERE 
          t2.visibility = TRUE
          AND t1.days_of_week @> $1::jsonb
          AND $2::time BETWEEN t1.start_time AND t1.end_time;
    `;
    const values = [JSON.stringify([currentDay]), currentTime];

    const result: QueryResult = await this.pool.query(sql, values);

    return result.rows.map(this.mapRowToPromotion);
  }
}
