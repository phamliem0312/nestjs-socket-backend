import { Injectable } from '@nestjs/common';
import { VnIntradayRepository } from './vn-intraday.repository';
import { VnIntradayEntity } from './serializers/vn-intraday.serializer';

@Injectable()
export class VnIntradayService {
  constructor(private readonly vnIntradayRepository: VnIntradayRepository) {}

  async findAll(): Promise<VnIntradayEntity[]> {
    return await this.vnIntradayRepository.findAll();
  }

  async findByCode(code: string): Promise<VnIntradayEntity[]> {
    return await this.vnIntradayRepository.find({ code });
  }
}
