import { Router } from 'express';
import { IPromotionController } from 'modules/promotions/promotions.controller.js';

export const createPromotionRouter = (
  controller: IPromotionController,
): Router => {
  const router = Router();

  router.get('/active', controller.getActiveMenuPromotions.bind(controller));

  router.post('/', controller.create.bind(controller));

  router.get('/', controller.findAll.bind(controller));

  router.get('/:id', controller.findById.bind(controller));

  router.put('/:id', controller.update.bind(controller));

  router.delete('/:id', controller.delete.bind(controller));

  return router;
};
