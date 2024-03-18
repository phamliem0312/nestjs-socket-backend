import { ModelRepository } from '../model.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoTickRepository extends ModelRepository {
  entityName: string = 'crypto_ticks';
}
