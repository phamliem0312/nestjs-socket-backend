import { Injectable } from '@nestjs/common';
import { VnIntradayRepository } from './vn-intraday.repository';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class VnIntradayService {
  constructor(
    private readonly vnIntradayRepository: VnIntradayRepository,
    @InjectModel() private readonly knex: Knex,
  ) {}
}
