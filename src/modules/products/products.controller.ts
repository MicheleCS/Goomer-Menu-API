import { Request, Response, NextFunction } from 'express';
import { IProductService } from './products.service.js';
import { plainToClass } from 'class-transformer';
import { CreateProductDto } from '../../shared/dtos/CreateProductDto.js';
import { validate } from 'class-validator';
import { UpdateProductDto } from '../../shared/dtos/UpdateProductDto.js';
export interface IProductController {
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
  findActiveMenuProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void>;
}

export class ProductController implements IProductController {
  private readonly productService: IProductService;

  constructor(service: IProductService) {
    this.productService = service;
  }

  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const productDto = plainToClass(CreateProductDto, req.body);

      const errors = await validate(productDto);

      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Erro de validação',
          details: errors
            .map((err) => Object.values(err.constraints || {}))
            .flat(),
        });
      }
      const newProduct = await this.productService.createProduct(productDto);

      return res.status(201).json(newProduct);
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
      const products = await this.productService.findAllProducts();

      return res.status(200).json(products);
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
      const product = await this.productService.getProductById(id);

      return res.status(200).json(product);
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
      const productDto = plainToClass(UpdateProductDto, req.body);

      const updatedProduct = await this.productService.updateProduct(
        id,
        productDto,
      );
      return res.status(200).json(updatedProduct);
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

      await this.productService.deleteProduct(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async findActiveMenuProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const activeProducts = await this.productService.findActiveMenuProducts();
      return res.status(200).json(activeProducts);
    } catch (error) {
      next(error);
    }
  }
}
