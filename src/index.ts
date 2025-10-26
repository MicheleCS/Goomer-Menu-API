import { createApp } from './app.js';
import { ProductController } from './modules/products/products.controller.js';
import { pool } from './db.config.js';
import { ProductService } from './modules/products/products.service.js';
import { ProductRepository } from './shared/repositories/products.repository.js';
import { AppDataSource } from './ormconfig.js';

const PORT = process.env.PORT || 3000;
const productRepository = new ProductRepository(pool);
const productService = new ProductService(productRepository);
const productControllerInstance = new ProductController(productService);

async function startApplication() {
  try {
    console.log('Inicializando e rodando migrações...');
    await AppDataSource.initialize();

    await AppDataSource.runMigrations();
    console.log('Migrações executadas com sucesso.');

    const app = createApp(productControllerInstance);
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro na inicialização:', error);
    process.exit(1);
  }
}

startApplication();
