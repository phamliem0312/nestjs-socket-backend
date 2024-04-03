import { ModelRepository } from '../model.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoTickRepository extends ModelRepository {
  entityName: string = 'crypto_m1s';

  async getDataByEntity(
    symbolCode: string,
    from: string,
    entity: string,
  ): Promise<any> {
    const entityName = entity ? entity : this.entityName;
    const result = await this.knex
      .select('symbol', 'open', 'close', 'high', 'low', 'volume')
      .from(entityName)
      .where('symbol', symbolCode)
      .andWhere('date', '>=', from)
      .orderBy('date', 'asc')
      .limit(1)
      .offset(0);

    return result ? result : [];
  }
}
