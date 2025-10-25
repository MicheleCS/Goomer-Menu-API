import { PromotionRepository } from '@shared/repositories/promotions.repository';
import { ProductRepository } from '../../shared/repositories/products.repository';
import { pool } from './db.config';

const productRepository = new ProductRepository(pool);
const promotionRepository = new PromotionRepository(pool);

async function startApplication() {
  try {
    const products = await productRepository.findAll();
    console.log('Produtos encontrados:', products);
    const promotions = await promotionRepository.findAll();
    console.log('Econtrados:', products, promotions);
  } catch (error) {
    console.error('Erro na aplicação:', error);
  } finally {
  }
}

startApplication();
