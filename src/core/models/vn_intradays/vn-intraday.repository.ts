import { Injectable } from '@nestjs/common';
import { VnIntradayEntity } from './serializers/vn-intraday.serializer';
import { ModelRepository } from '../model.repository';
import { VnIntraday } from './vn-intraday.entity';
import { plainToClass, classToPlain } from 'class-transformer';
import { Pagination } from '../pagination';

@Injectable()
export class VnIntradayRepository extends ModelRepository<
  VnIntraday,
  VnIntradayEntity
> {
  async findAllPaginate(
    code: string,
    take: number | null,
    page: number | null,
    relations: string[] = [],
  ): Promise<Pagination<VnIntradayEntity>> {
    const takeRecord = take || 30;
    const paginate = page || 1;
    const skip = (paginate - 1) * takeRecord;
    const [results, total] = await this.findAndCount({
      where: { code },
      relations,
      take: takeRecord,
      skip: skip,
    });

    return new Pagination<VnIntradayEntity>({
      results,
      total,
    });
  }
  transform(model: VnIntraday): VnIntradayEntity {
    const transformOptions = {};

    return plainToClass(
      VnIntradayEntity,
      classToPlain(model, transformOptions),
      transformOptions,
    );
  }

  transformMany(models: VnIntraday[]): VnIntradayEntity[] {
    return models.map((model) => this.transform(model));
  }
}
