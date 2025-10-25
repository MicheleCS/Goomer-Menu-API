import { ProductRepository } from '../../shared/repositories/products.repository';
import { pool } from './db.config'; 


const productRepository = new ProductRepository(pool);

async function startApplication() {
    try {
        console.log('Buscando todos os produtos...');
        const products = await productRepository.findAll();
        console.log('Produtos encontrados:', products);

    } catch (error) {
        console.error('Erro na aplicação:', error);
    } finally {
    }
}

startApplication();