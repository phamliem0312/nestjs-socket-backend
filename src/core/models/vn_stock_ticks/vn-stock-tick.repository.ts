import { ModelRepository } from '../model.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VnStockTickRepository extends ModelRepository {
  entityName: string = 'vnstock_event';

  async insertOne(data: object) {
    const isInserted = await this.knex(this.entityName).insert(data);
    return isInserted;
  }
}
