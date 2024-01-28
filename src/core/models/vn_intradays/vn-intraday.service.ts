import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { VnIntradayRepository } from './vn-intraday.repository';
import { VnIntradayEntity } from './serializers/vn-intraday.serializer';
import { Pagination } from '../pagination';

@Injectable()
export class VnIntradayService {
  constructor(
    @InjectRepository(VnIntradayRepository)
    private VnIntradayRepository: VnIntradayRepository,
  ) {}

  async findAll(
    relations: string[] = [],
    throwsException = false,
  ): Promise<VnIntradayEntity[]> {
    return await this.VnIntradayRepository.getAllEntity(
      relations,
      throwsException,
    );
  }

  async findAllPaginate(
    code: string,
    take: number | null,
    page: number | null,
    relations: string[] = [],
  ): Promise<Pagination<VnIntradayEntity>> {
    return this.VnIntradayRepository.findAllPaginate(
      code,
      take,
      page,
      relations,
    );
  }
}
