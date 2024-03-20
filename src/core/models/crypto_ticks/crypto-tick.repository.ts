import { ModelRepository } from '../model.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoTickRepository extends ModelRepository {
  entityName: string = 'crypto_tick_s1s';

  async getDataByEntity(
    symbolCode: string,
    from: string,
    to: string,
    entity: string,
  ): Promise<any> {
    const entityName = entity ? entity : this.entityName;
    const result = await this.knex
      .select('symbol', 'open', 'close', 'high', 'low', 'volume')
      .from(entityName)
      .where('symbol', symbolCode)
      .andWhere('date', '>=', from)
      .andWhere('date', '<=', to)
      .orderBy('date', 'asc');

    return result ? result : [];
  }
}
