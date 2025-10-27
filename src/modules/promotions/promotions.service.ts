import { Promotion } from 'shared/database/entities/promotions.entity.js';
import { IPromotionRepository } from 'shared/repositories/promotions.repository.js';
import { CreatePromotionDto } from 'shared/dtos/CreatePromotionDto.js';
import { UpdatePromotionDto } from 'shared/dtos/UpdatePromotionDto.js';
import { IProductRepository } from 'shared/repositories/products.repository.js';

export interface IPromotionService {
  createPromotion(data: CreatePromotionDto): Promise<Promotion>;
  findAllPromotions(): Promise<Promotion[]>;
  getPromotionById(id: string): Promise<Promotion>;
  updatePromotion(id: string, data: UpdatePromotionDto): Promise<Promotion>;
  deletePromotion(id: string): Promise<void>;
  findActivePromotionsByProductId(productId: string): Promise<Promotion[]>;
}

export class PromotionService implements IPromotionService {
  private readonly promotionRepository: IPromotionRepository;
  private readonly productRepository: IProductRepository;

  constructor(
    promotionRepository: IPromotionRepository,
    productRepository: IProductRepository,
  ) {
    this.promotionRepository = promotionRepository;
    this.productRepository = productRepository;
  }

  async createPromotion(data: CreatePromotionDto): Promise<Promotion> {
    const { promotionalPrice, productId } = data;

    if (promotionalPrice <= 0) {
      throw new Error('O preço promocional deve ser positivo.');
    }

    if (!(await this.productRepository.findById(productId))) {
      throw new Error(`Produto com ID ${productId} não encontrado.`);
    }

    return this.promotionRepository.create(data);
  }

  async getPromotionById(id: string): Promise<Promotion> {
    const promotion = await this.promotionRepository.findById(id);

    if (!promotion) {
      throw new Error(`Promoção com ID ${id} não encontrada.`);
    }
    return promotion;
  }

  async findAllPromotions(): Promise<Promotion[]> {
    return this.promotionRepository.findAll();
  }

  async updatePromotion(
    id: string,
    data: UpdatePromotionDto,
  ): Promise<Promotion> {
    await this.getPromotionById(id);

    if (data.promotionalPrice !== undefined && data.promotionalPrice <= 0) {
      throw new Error('O preço promocional atualizado deve ser positivo.');
    }

    const updatedPromotion = await this.promotionRepository.update(id, data);

    if (!updatedPromotion) {
      throw new Error('Falha ao atualizar a promoção.');
    }
    return updatedPromotion;
  }

  async deletePromotion(id: string): Promise<void> {
    await this.getPromotionById(id);
    await this.promotionRepository.delete(id);
  }

  async findActivePromotionsByProductId(
    productId: string,
  ): Promise<Promotion[]> {
    return this.promotionRepository.findActiveByProductId(productId);
  }
}
