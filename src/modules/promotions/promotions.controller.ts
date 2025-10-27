import { Request, Response, NextFunction } from 'express';
import { IPromotionService } from './promotions.service.js';
import { validate } from 'class-validator';
import { CreatePromotionDto } from '../../shared/dtos/CreatePromotionDto.js';
import { UpdatePromotionDto } from '../../shared/dtos/UpdatePromotionDto.js';
import { plainToClass } from 'class-transformer';

export interface IPromotionController {
  create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void>;
  findAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void>;
  findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void>;
  update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void>;
  delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void>;
  findActiveByProductId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void>;
}

export class PromotionController implements IPromotionController {
  private readonly promotionService: IPromotionService;

  constructor(service: IPromotionService) {
    this.promotionService = service;
  }

  private async validateAndHandleErrors(
    dtoClass: any,
    data: any,
    res: Response,
  ): Promise<any> {
    const dtoInstance = plainToClass(dtoClass, data);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      res.status(400).json({
        message: 'Erro de validação',
        details: errors
          .map((err) => Object.values(err.constraints || {}))
          .flat(),
      });
      return null;
    }
    return dtoInstance;
  }

  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const promotionDto = await this.validateAndHandleErrors(
        CreatePromotionDto,
        req.body,
        res,
      );

      if (!promotionDto) return;

      const newPromotion =
        await this.promotionService.createPromotion(promotionDto);

      return res.status(201).json(newPromotion);
    } catch (error) {
      next(error);
    }
  }

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const promotions = await this.promotionService.findAllPromotions();

      return res.status(200).json(promotions);
    } catch (error) {
      next(error);
    }
  }

  async findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const id: string = req.params.id;
      const promotion = await this.promotionService.getPromotionById(id);

      return res.status(200).json(promotion);
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const id: string = req.params.id;
      const promotionDto = await this.validateAndHandleErrors(
        UpdatePromotionDto,
        req.body,
        res,
      );

      if (!promotionDto) return;

      const updatedPromotion = await this.promotionService.updatePromotion(
        id,
        promotionDto,
      );
      return res.status(200).json(updatedPromotion);
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const id: string = req.params.id;

      await this.promotionService.deletePromotion(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async findActiveByProductId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const productId: string = req.params.productId;

      const promotions =
        await this.promotionService.findActivePromotionsByProductId(productId);

      return res.status(200).json(promotions);
    } catch (error) {
      next(error);
    }
  }
}
