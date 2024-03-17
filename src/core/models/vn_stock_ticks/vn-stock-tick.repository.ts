import { ModelRepository } from '../model.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VnStockTickRepository extends ModelRepository {
  entityName: string = 'vnstock_ticks';

  async getTickByMinute(
    symbolCode: string,
    intervalTime: number | string,
  ): Promise<any> {
    const result = await this.knex.raw(`
      select 
        from_unixtime(floor(unix_timestamp(DATE)/(${intervalTime}*60))*(${intervalTime}*60)) as time,
        min(date_format(DATE, '%Y-%m-%d %H:%i:%s')) as minDate,
        max(date_format(DATE, '%Y-%m-%d %H:%i:%s')) as maxDate,
        max(HIGH) as high,
        min(LOW) as low,
        sum(VOLUME) as volume
      from ${this.entityName}
      where SYMBOL="${symbolCode}"
      group by 1
      order by 1 desc
      limit 1 offset 0
      `);

    return result[0][0] ? result[0][0] : {};
  }

  async getTickByDay(symbolCode: string, resolution: string): Promise<any> {
    const selectDateSqlMap = {
      '1D': "date_format(DATE, '%Y-%m-%d')",
      '1W': "concat(week(DATE), '/', year(DATE))",
      '1M': "concat(month(DATE), '/', year(DATE))",
    };
    const result = await this.knex.raw(`
      select 
        ${selectDateSqlMap[resolution]} as week,
        min(date_format(DATE, '%Y-%m-%d %H:%i:%s')) as minDate,
        max(date_format(DATE, '%Y-%m-%d %H:%i:%s')) as maxDate,
        max(HIGH) as high,
        min(LOW) as low,
        sum(VOLUME) as volume
      from ${this.entityName}
      where SYMBOL="${symbolCode}"
      group by 1
      order by 1 desc
      limit 1 offset 0
      `);

    return result[0][0] ? result[0][0] : {};
  }

  async getDataByResolution(
    exchange: string,
    symbolCode: string,
    from: string,
    to: string,
  ): Promise<any> {
    const entityName =
      exchange === 'binance' ? 'crypto_ticks' : 'vnstock_ticks';
    const result = await this.knex
      .select('symbol', 'open', 'close', 'high', 'low', 'volume')
      .from(entityName)
      .where('symbol', symbolCode)
      .andWhere('date', '>=', from)
      .andWhere('date', '<', to)
      .orderBy('date', 'asc');

    return result ? result : [];
  }
}
