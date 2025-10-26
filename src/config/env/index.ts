import { pool } from './db.config'; 
import { ProductRepository } from '@shared/repositories/products.repository';
import { ProductService } from '@modules/products/products.service'; 
import { ProductController } from '@modules/products/products.controller'; 
import { createApp } from 'app';

const PORT = process.env.PORT || 3000;
const productRepository = new ProductRepository(pool);
const productService = new ProductService(productRepository); 
const productControllerInstance = new ProductController(productService);
const app = createApp(productControllerInstance); 

async function startApplication() {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erro na inicialização:', error);
        process.exit(1);
    }
}

startApplication();