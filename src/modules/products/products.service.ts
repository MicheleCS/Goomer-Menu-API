import { Product } from '@shared/database/entities/products.entity';
import { ProductRepository } from '@shared/repositories/products.repository';

export interface IProductService {
  createProduct(data: Omit<Product, 'id'>): Promise<Product>;
  findAllProducts(): Promise<Product[]>;
  updateProduct(id: number, data: Partial<Omit<Product, 'id'>>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  getProductById(id: number): Promise<Product>;
}

export class ProductService implements IProductService {
  private readonly productRepository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.productRepository = repository;
  }

  async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
    const { name, price } = data;

    if (!name || name.trim().length === 0) {
      throw new Error('O nome do produto é obrigatório.');
    }
    if (price <= 0) {
      throw new Error('O preço do produto deve ser positivo.');
    }

    return this.productRepository.create(data);
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error(`Produto com ID ${id} não encontrado.`);
    }
    return product;
  }
  async findAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async updateProduct(id: number, data: Partial<Omit<Product, 'id'>>): Promise<Product> {
    await this.getProductById(id); 
    if (data.price !== undefined && data.price <= 0) {
      throw new Error('O preço atualizado deve ser positivo.');
    }
    const updatedProduct = await this.productRepository.update(id, data); 

    if (!updatedProduct) {
        throw new Error('Falha ao atualizar o produto.');
    }
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.getProductById(id);
    await this.productRepository.delete(id);
  }
}