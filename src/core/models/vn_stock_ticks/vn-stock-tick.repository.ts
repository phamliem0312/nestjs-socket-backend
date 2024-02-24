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
        max(OPEN) as open,
        max(HIGH) as high,
        min(LOW) as low,
        max(CLOSE) as close,
        sum(VOLUME) as volume,
        SYMBOL as symbol,
        count(*) as total
      from ${this.entityName}
      where SYMBOL="${symbolCode}"
      group by 1
      order by 1 desc
      limit 1 offset 1
      `);

    return result[0][0] ? result[0][0] : {};
  }

  async getTicksByDay(symbolCode: string, resolution: string): Promise<any> {
    const selectDateSqlMap = {
      '1D': "date_format(DATE, '%Y-%m-%d')",
      '1W': "concat(week(DATE), '/', year(DATE))",
      '1M': "concat(month(DATE), '/', year(DATE))",
    };
    const result = await this.knex.raw(`
      select 
        ${selectDateSqlMap[resolution]} as time,
        max(OPEN) as open,
        max(HIGH) as high,
        min(low) as low,
        min(close) as close,
        sum(VOLUME) as volume,
        SYMBOL as symbol,
        count(*) as total
      from ${this.entityName}
      where SYMBOL="${symbolCode}"
      group by 1
      order by 1 desc
      `);

    return result[0][0] ? result[0][0] : {};
  }
}
