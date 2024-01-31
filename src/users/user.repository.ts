import { Injectable } from '@nestjs/common';
import { RepositoryBase } from 'src/core/repositories/base.repository';

@Injectable()
export class UserRepository extends RepositoryBase {
  entityName: string = 'User';
}
