import { ModelRepository } from '../model.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VnStockTickRepository extends ModelRepository {
  entityName: string = 'vnstock_ticks';
}
