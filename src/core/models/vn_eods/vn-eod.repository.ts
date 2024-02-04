import { ModelRepository } from '../model.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VnEodRepository extends ModelRepository {
  entityName: string = 'vn_eod';
}
