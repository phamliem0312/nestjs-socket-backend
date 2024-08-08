import { ModelRepository } from '../model.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoTickRepository extends ModelRepository {
  entityName: string = 'crypto_m1s';

  async getDataBySymbol(
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
      .orderBy('symbol', 'asc')
      .orderBy('date', 'desc')
      .limit(1)
      .offset(0);

    return result ? result : [];
  }

  async getDataByEntity(from: string, entity: string): Promise<any> {
    const entityName = entity ? entity : this.entityName;

    const result = await this.knex
      .select('symbol', 'open', 'close', 'high', 'low', 'volume')
      .from(entityName)
      .where('date', '>=', from)
      .orderBy('symbol', 'asc')
      .orderBy('date', 'desc');

    return result ? result : [];
  }
}
