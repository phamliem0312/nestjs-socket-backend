import { Injectable } from '@nestjs/common';
import { VnStockTickRepository } from './vn-stock-tick.repository';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import * as moment from 'moment';
@Injectable()
export class VnStockTickService {
  private resolutionMap: string[] = ['1', '10', '15', '30', '1D', '1W', '1M'];
  constructor(
    private readonly vnStockTickRepository: VnStockTickRepository,
    @InjectModel() private readonly knex: Knex,
  ) {}

  async getSocketData(symbolCode: string, resolution: string): Promise<any> {
    const now = moment().format('Y-MM-DD HH:mm');
    return {
      symbol: symbolCode,
      open: 17000,
      high: 17000,
      low: 16950,
      volume: 129300,
      time: now,
    };
  }
}
