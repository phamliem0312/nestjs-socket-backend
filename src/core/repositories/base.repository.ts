import { Injectable } from '@nestjs/common';
import { ModelRepository } from '../models/model.repository';

@Injectable()
export class RepositoryBase extends ModelRepository {
}
