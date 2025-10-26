import { Request, Response, NextFunction } from 'express';
import { IProductService } from './products.service';

export interface IProductController {
    create(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    findAll(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    findById(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    update(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<Response | void>;
}

export class ProductController implements IProductController {
    private readonly productService: IProductService;

    constructor(service: IProductService) {
        this.productService = service;
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const productData = req.body; 
            
            const newProduct = await this.productService.createProduct(productData);

            return res.status(201).json(newProduct);

        } catch (error) {
            next(error);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const products = await this.productService.findAllProducts();
            
            return res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    async findById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const id = parseInt(req.params.id); 

            if (isNaN(id)) {
                return res.status(400).json({ message: 'O ID deve ser um número válido.' });
            }
            
            const product = await this.productService.getProductById(id);
            
            return res.status(200).json(product);
        } catch (error) {
            next(error); 
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const id = parseInt(req.params.id);
            const productData = req.body;

            if (isNaN(id)) {
                return res.status(400).json({ message: 'O ID deve ser um número válido.' });
            }

            const updatedProduct = await this.productService.updateProduct(id, productData);
            return res.status(200).json(updatedProduct);

        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const id = parseInt(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'O ID deve ser um número válido.' });
            }
            
            await this.productService.deleteProduct(id);
            return res.status(204).send();

        } catch (error) {
            next(error);
        }
    }
}