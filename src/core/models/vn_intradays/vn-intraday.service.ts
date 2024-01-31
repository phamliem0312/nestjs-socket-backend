import { Injectable } from '@nestjs/common';
import { VnIntradayRepository } from './vn-intraday.repository';
import { VnIntradayEntity } from './serializers/vn-intraday.serializer';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class VnIntradayService {
  constructor(
    private readonly vnIntradayRepository: VnIntradayRepository,
    @InjectModel() private readonly knex: Knex,
  ) {}

  async findAll(): Promise<VnIntradayEntity[]> {
    return await this.vnIntradayRepository.findAll();
  }

  async findByCode(code: string): Promise<VnIntradayEntity[]> {
    return await this.vnIntradayRepository.find({ code });
  }
}
