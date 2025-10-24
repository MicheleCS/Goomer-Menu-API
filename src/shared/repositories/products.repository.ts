interface IProductRepository {
  create(data: Omit<IProduct, 'id'>): Promise<IProduct>;
  findAll(): Promise<IProduct[]>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<IProduct | null>;
}

// Assumindo que você tem um pool de conexões (ou client) do 'pg'
// e ele é injetado no construtor.
import { Pool, PoolClient, QueryResult } from 'pg'; // Certifique-se de ter o 'pg' instalado
import { IProduct } from '../database/entities/products.entity';

export class ProductRepository implements IProductRepository {
  private readonly pool: Pool;
  private readonly TABLE_NAME = 'products'; // Nome da sua tabela

  constructor(pool: Pool) {
      this.pool = pool;
  }

  // Função auxiliar para mapear a linha do DB para o objeto IProduct
  private mapRowToProduct(row: any): IProduct {
      return {
          id: row.id,
          name: row.name,
          price: parseFloat(row.price), // Garante que o price é um número
          // Mapeie outros campos conforme necessário
      } as IProduct;
  }

  // Implementação do método CREATE (com SQL Puro)
  async create(data: Omit<IProduct, 'id'>): Promise<IProduct> {
      const { name, price } = data; // Ajuste para os campos da sua entidade
      
      const sql = `
          INSERT INTO ${this.TABLE_NAME} (name, price)
          VALUES ($1, $2)
          RETURNING *;
      `;
      
      const values = [name, price];

      const result: QueryResult = await this.pool.query(sql, values);
      
      // Verifica se alguma linha foi inserida
      if (result.rows.length === 0) {
          throw new Error('Falha ao criar o produto.');
      }

      // RETURNING * retorna a linha inserida, mapeamos para IProduct
      return this.mapRowToProduct(result.rows[0]); 
  }

  // Implementação do método FINDALL (com SQL Puro)
  async findAll(): Promise<IProduct[]> {
      const sql = `SELECT * FROM ${this.TABLE_NAME} ORDER BY id ASC;`;

      const result: QueryResult = await this.pool.query(sql);

      // Mapeia todas as linhas para o formato IProduct
      return result.rows.map(this.mapRowToProduct);
  }
  
  // Implementação do método DELETE (com SQL Puro)
  async delete(id: number): Promise<void> {
      const sql = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1;`;
      
      // A função query retorna uma Promise<QueryResult>
      await this.pool.query(sql, [id]);
      
      // Não precisamos verificar rowCount aqui se o método é `void` e apenas deleta
      // (A menos que você queira lançar um erro se nenhum item foi deletado)
  }

  // Implementação do método FIND (por ID) (com SQL Puro)
  async findById(id: number): Promise<IProduct | null> {
      const sql = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1;`;
      
      const result: QueryResult = await this.pool.query(sql, [id]);

      // Se encontrou, retorna o produto mapeado
      if (result.rows.length > 0) {
          return this.mapRowToProduct(result.rows[0]);
      }

      // Se não encontrou, retorna null
      return null;
  }
}