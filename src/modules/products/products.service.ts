import { Product } from 'shared/database/entities/products.entity.js';
import { CreateProductDto } from 'shared/dtos/CreateProductDto.js';
import { UpdateProductDto } from 'shared/dtos/UpdateProductDto.js';
import { ProductRepository } from 'shared/repositories/products.repository.js';

export interface IProductService {
  createProduct(productData: CreateProductDto): Promise<Product>;
  findAllProducts(): Promise<Product[]>;
  updateProduct(id: string, productData: UpdateProductDto): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  getProductById(id: string): Promise<Product>;
}

export class ProductService implements IProductService {
  private readonly productRepository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.productRepository = repository;
  }

  async createProduct(productData: CreateProductDto): Promise<Product> {
    const { name, price } = productData;

    if (!name || name.trim().length === 0) {
      throw new Error('O nome do produto é obrigatório.');
    }
    if (price <= 0) {
      throw new Error('O preço do produto deve ser positivo.');
    }

    return this.productRepository.create(productData);
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error(`Produto com ID ${id} não encontrado.`);
    }
    return product;
  }
  async findAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async updateProduct(
    id: string,
    productData: UpdateProductDto,
  ): Promise<Product> {
    await this.getProductById(id);
    if (productData.price !== undefined && productData.price <= 0) {
      throw new Error('O preço atualizado deve ser positivo.');
    }
    const updatedProduct = await this.productRepository.update(id, productData);

    if (!updatedProduct) {
      throw new Error('Falha ao atualizar o produto.');
    }
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.getProductById(id);
    await this.productRepository.delete(id);
  }
}
