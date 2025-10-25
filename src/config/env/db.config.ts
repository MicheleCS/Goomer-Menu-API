import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  max: 20,
  idleTimeoutMillis: 30000,
};
export const pool = new Pool(config);
pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL com sucesso!');
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool do PostgreSQL', err);
});
