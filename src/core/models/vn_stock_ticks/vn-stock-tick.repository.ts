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
    symbolCode: string,
    dateSelect: string,
    limit: number = 1,
    order: string = 'desc',
  ): Promise<any> {
    const result = await this.knex.raw(`
      SELECT distinct
        date_format(a.time, '%Y-%m-%d %H:%i:%s') as time,
        date_format(DATE, '%Y-%m-%d %H:%i:%s') as date,
        OPEN as open,
        CLOSE as close,
        a.volume as volume,
        a.high as high,
        a.low as low
      from vnstock_ticks right join
      (
      SELECT
          ${dateSelect} as time,
          min(DATE) as min_date,
          max(DATE) as max_date,
          sum(VOLUME) as volume,
          max(HIGH) as high,
          min(low) as low
      FROM ${this.entityName}
      where SYMBOL = '${symbolCode}'
      group by 1
      order by 1 ${order}
      limit ${limit} offset 0
      ) a on a.min_date = date or a.max_date = date
      where SYMBOL = '${symbolCode}'
      `);

    return result[0] ? result[0] : [];
  }

  async getOpenCloseByDate(
    symbolCode: string,
    minDate: string,
    maxDate: string,
  ): Promise<any> {
    const result1 = await this.knex.raw(`
      select 
        OPEN as open
      from ${this.entityName}
      where SYMBOL="${symbolCode}"
        and DATE="${maxDate}"
      order by DATE desc
      limit 1 offset 0
      `);

    const result2 = await this.knex.raw(`
      select 
        CLOSE as close
      from ${this.entityName}
      where SYMBOL="${symbolCode}"
        and DATE="${minDate}"
      order by DATE asc
      limit 1 offset 0
      `);

    return {
      open: result1[0][0].open ?? 0,
      close: result2[0][0].close ?? 0,
    };
  }
}
