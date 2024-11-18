import { ModelRepository } from '../model.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommodityRepository extends ModelRepository {
  async getMinuteData(fromTime: string): Promise<any> {
    const entityName = 'commodity_m1s';

    const result = await this.knex
      .select('symbol', 'open', 'close', 'high', 'low', 'volume')
      .from(entityName)
      .where('date', '>=', fromTime)
      .orderBy('symbol', 'asc')
      .orderBy('date', 'desc');

    return result ? result : [];
  }

  async getDayData(fromTime: string): Promise<any> {
    const entityName = 'commodity_d1s';

    const result = await this.knex
      .select('symbol', 'open', 'close', 'high', 'low', 'volume')
      .from(entityName)
      .where('date', '>=', fromTime)
      .orderBy('symbol', 'asc')
      .orderBy('date', 'desc');

    return result ? result : [];
  }

  async findAll(resolution: string): Promise<any> {
    const entityName = resolution;

    const result = await this.knex
      .select('symbol', 'open', 'close', 'high', 'low', 'volume', 'date')
      .from(entityName)
      .orderBy('symbol', 'asc')
      .orderBy('date', 'desc');

    return result ? result : [];
  }

  async getAllData(params: Array<string | number>): Promise<any> {
    const result = await this.knex
      .select(
        this.knex.raw('"1m" as resolution'),
        this.knex.raw('"' + params[1] + '"' + ' as datetime'),
        this.knex.raw('"' + params[8] + '"' + ' as time'),
        'symbol',
        'open',
        'close',
        'high',
        'low',
        'volume',
      )
      .from('commodity_m1s')
      .where('date', params[0])
      .whereNot('symbol', '')
      .unionAll(
        this.knex
          .select(
            this.knex.raw('"60" as resolution'),
            this.knex.raw('"' + params[3] + '"' + ' as datetime'),
            this.knex.raw('"' + params[9] + '"' + ' as time'),
            'symbol',
            'open',
            'close',
            'high',
            'low',
            'volume',
          )
          .from('commodity_h1s')
          .where('date', params[2])
          .whereNot('symbol', ''),
        this.knex
          .select(
            this.knex.raw('"240" as resolution'),
            this.knex.raw('"' + params[5] + '"' + ' as datetime'),
            this.knex.raw('"' + params[10] + '"' + ' as time'),
            'symbol',
            'open',
            'close',
            'high',
            'low',
            'volume',
          )
          .from('commodity_h4s')
          .where('date', params[4])
          .whereNot('symbol', ''),
        this.knex
          .select(
            this.knex.raw('"1D" as resolution'),
            this.knex.raw('"' + params[7] + '"' + ' as datetime'),
            this.knex.raw('"' + params[11] + '"' + ' as time'),
            'symbol',
            'open',
            'close',
            'high',
            'low',
            'volume',
          )
          .from('commodity_d1s')
          .where('date', params[6])
          .whereNot('symbol', ''),
      )
      .orderBy('symbol', 'asc');

    return result ? result : [];
  }
}
