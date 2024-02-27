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

  async getTicksByMinute(
    symbolCode: string,
    from: string,
    to: string,
  ): Promise<any> {
    const result = await this.knex.raw(`
      select 
        date_format(from_unixtime(floor(unix_timestamp(DATE)/(1*60))*(1*60)), '%Y-%m-%dT%H-%i-00') as time,
        OPEN as open,
        CLOSE as close,
        HIGH as high,
        LOW as low,
        VOLUME as volume
      from ${this.entityName}
      where SYMBOL="${symbolCode}"
        and DATE >= ${from}
        and DATE < ${to}
      order by DATE asc
      `);

    return result[0][0] ? result[0][0] : {};
  }

  async getOpenCloseByDate(
    symbolCode: string,
    minDate: string,
    maxDate: string,
  ): Promise<any> {
    const result1 = await this.knex.raw(`
      select 
        CLOSE as close
      from ${this.entityName}
      where SYMBOL="${symbolCode}"
        and DATE="${maxDate}"
      order by DATE desc
      limit 1 offset 0
      `);

    const result2 = await this.knex.raw(`
      select 
        OPEN as open
      from ${this.entityName}
      where SYMBOL="${symbolCode}"
        and DATE="${minDate}"
      order by DATE asc
      limit 1 offset 0
      `);

    return {
      open: result2[0][0].open,
      close: result1[0][0].close,
    };
  }
}
