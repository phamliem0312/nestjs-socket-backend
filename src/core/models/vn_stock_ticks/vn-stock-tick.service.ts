import { Injectable } from '@nestjs/common';
import { VnStockTickRepository } from './vn-stock-tick.repository';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class VnStockTickService {
  constructor(
    private readonly vnStockTickRepository: VnStockTickRepository,
    @InjectModel() private readonly knex: Knex,
  ) {}

  async findAll(): Promise<any[]> {
    return await this.vnStockTickRepository.findAll();
  }

  async findByCode(code: string): Promise<any[]> {
    return await this.vnStockTickRepository.find({ code });
  }
}
