import { Injectable, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class ModelRepository {
  entityName: string = '';
  constructor(@InjectModel() private readonly knex: Knex) {}

  async findAll(): Promise<any> {
    return await this.knex.table(this.entityName);
  }

  async findOne(id: string): Promise<any> {
    if (!id) {
      throw new NotFoundException(`${this.entityName} ${id} does not exist`);
    }
    return await this.knex.table(this.entityName).where('id', id);
  }

  async find(whereClause: object): Promise<any> {
    return await this.knex.table(this.entityName).where(whereClause);
  }
}
