import { Pool, QueryResult } from 'pg';
import { IPromotion } from '../database/entities/promotions.entity';
import { DayOfWeek } from '../enums/dayOfWeek';


type CreatePromotionData = Omit<IPromotion, 'id'>;

export interface IPromotionRepository {
    create(data: CreatePromotionData): Promise<IPromotion>;
    findAll(): Promise<IPromotion[]>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<IPromotion | null>;
    findActiveByProductId(productId: string): Promise<IPromotion[]>;
}

export class PromotionRepository implements IPromotionRepository {
    private readonly pool: Pool;
    private readonly TABLE_NAME = 'promotions';

    constructor(pool: Pool) {
        this.pool = pool;
    }

    private mapRowToPromotion(row: any): IPromotion {
        return {
            id: row.id,
            productId: row.product_id,
            description: row.description,
            promotionalPrice: parseFloat(row.promotional_price),
            daysOfWeek: row.days_of_week as DayOfWeek[],
            startTime: row.start_time,
            endTime: row.end_time,
            visibility: row.visibility,
        } as IPromotion;
    }

    async create(data: CreatePromotionData): Promise<IPromotion> {
        const { 
            productId, description, promotionalPrice, 
            daysOfWeek, startTime, endTime, visibility 
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
            productId, description, promotionalPrice, 
            daysOfWeek, startTime, endTime, visibility
        ];

        const result: QueryResult = await this.pool.query(sql, values);
        
        if (result.rows.length === 0) {
            throw new Error('Falha ao criar a promoção no banco de dados.');
        }

        return this.mapRowToPromotion(result.rows[0]); 
    }

    async findAll(): Promise<IPromotion[]> {
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

    async findById(id: string): Promise<IPromotion | null> {
        const sql = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1;`;
        
        const result: QueryResult = await this.pool.query(sql, [id]);

        if (result.rows.length > 0) {
            return this.mapRowToPromotion(result.rows[0]);
        }

        return null;
    }

    // Método Específico: Encontra promoções visíveis para um produto (para o Cardápio)
    async findActiveByProductId(productId: string): Promise<IPromotion[]> {
        // Busca todas as promoções visíveis (visibity = TRUE) para um produto específico.
        // A lógica de checagem de horário/dia é feita no Service/Use Case do Cardápio.
        
        const sql = `
            SELECT * FROM ${this.TABLE_NAME}
            WHERE product_id = $1 AND visibility = TRUE;
        `;
        
        const result: QueryResult = await this.pool.query(sql, [productId]);
        
        return result.rows.map(this.mapRowToPromotion);
    }
}