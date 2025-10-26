import express, { Application } from 'express';
import { IProductController } from './modules/products/products.controller.js'; // Caminho corrigido
import path from 'path';
import { createProductRouter } from './routes/products.routes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const swaggerSpec = YAML.load(path.join(__dirname, '..', 'swagger.yaml'));

export const createApp = (
  productController: IProductController,
): Application => {
  const app = express();

  app.use(express.json());

  app.use('/goomer', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/products', createProductRouter(productController));

  app.use((error: any, res: express.Response) => {
    console.error(error);
    const status = error.statusCode || 500;
    const message = error.message || 'Ocorreu um erro interno no servidor.';

    res.status(status).json({ message });
  });

  return app;
};
