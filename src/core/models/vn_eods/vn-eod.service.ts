import { Injectable } from '@nestjs/common';
import { VnEodRepository } from './vn-eod.repository';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class VnEodService {
  constructor(
    private readonly vnEodRepository: VnEodRepository,
    @InjectModel() private readonly knex: Knex,
  ) {}
}
