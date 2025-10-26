import express, { Application } from 'express';
import { IProductController } from '@modules/products/products.controller';
import { createProductRouter } from './routes/products.routes'; 


export const createApp = (productController: IProductController): Application => {
    const app = express();
    
    app.use(express.json()); 

    app.use('/products', createProductRouter(productController));
    

    app.use('error');

    return app;
};