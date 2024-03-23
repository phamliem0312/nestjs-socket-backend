import { ModelRepository } from '../model.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VnStockTickRepository extends ModelRepository {
  entityName: string = 'vnstock_ticks';

  async getDataByResolution(symbolCode: string, from: string): Promise<any> {
    const result = await this.knex
      .select('symbol', 'open', 'close', 'high', 'low', 'volume')
      .from(this.entityName)
      .where('symbol', symbolCode)
      .andWhere('date', '>=', from)
      .orderBy('date', 'desc');

    return result ? result : [];
  }
}
