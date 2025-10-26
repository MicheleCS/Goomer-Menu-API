import { IProductController } from '@modules/products/products.controller';
import { Router } from 'express';

export const createProductRouter = (controller: IProductController): Router => {
    const router = Router();

    router.post('/', controller.create.bind(controller));

    router.get('/', controller.findAll.bind(controller));

    router.get('/:id', controller.findById.bind(controller));

    router.put('/:id', controller.update.bind(controller));

    router.delete('/:id', controller.delete.bind(controller));

    return router;
};