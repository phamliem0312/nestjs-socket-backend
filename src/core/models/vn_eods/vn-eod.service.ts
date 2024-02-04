import { Injectable } from '@nestjs/common';
import { VnEodRepository } from './vn-eod.repository';
import { VnEodEntity } from './vn-eod.entity';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class VnEodService {
  constructor(
    private readonly vnEodRepository: VnEodRepository,
    @InjectModel() private readonly knex: Knex,
  ) {}

  async findAll(): Promise<VnEodEntity[]> {
    return await this.vnEodRepository.findAll();
  }

  async findBySymbol(symbol: string): Promise<VnEodEntity[]> {
    return await this.vnEodRepository.find({ symbol });
  }
}
