import { ModelRepository } from '../model.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VnStockTickRepository extends ModelRepository {
  entityName: string = 'vnstock_ticks';

  async getTicksByMinute(symbolCode: string): Promise<any>{
    const result = await this.knex.raw(`
      select 
        date_format(DATE, '%Y-%m-%d %H:%i') as time,
        max(OPEN) as open,
        max(HIGH) as high,
        min(low) as low,
        sum(VOLUME) as volume,
        SYMBOL as symbol,
        count(*) as total
      from ${this.entityName}
      where SYMBOL="${symbolCode}"
      group by 1
      order by 1 desc
      `);

    return result[0];
  }

  async getTicksByDay(symbolCode: string): Promise<any>{
    const result = await this.knex.raw(`
      select 
        date_format(DATE, '%Y-%m-%d') as time,
        max(OPEN) as open,
        max(HIGH) as high,
        min(low) as low,
        sum(VOLUME) as volume,
        SYMBOL as symbol,
        count(*) as total
      from ${this.entityName}
      where SYMBOL="${symbolCode}"
      group by 1
      order by 1 desc
      `);

    return result[0];
  }
}
