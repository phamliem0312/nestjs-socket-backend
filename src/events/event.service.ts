import { Injectable } from '@nestjs/common';
import { CryptoTickService } from 'src/core/models/crypto_ticks/crypto-tick.service';
import { CommodityService } from 'src/core/models/commodities/commodity.service';
@Injectable()
export class EventService {
  constructor(
    private readonly cryptoTickService: CryptoTickService,
    private readonly commodityService: CommodityService,
  ) {}

  async getSocketDataBySymbol(symbolCode: string, resolution: string) {
    return await this.cryptoTickService.getSocketDataBySymbol(
      symbolCode,
      resolution,
    );
  }

  async getSocketDataByResolution(resolution: string) {
    return await this.cryptoTickService.getSocketDataByResolution(resolution);
  }

  async getCommoditySocketData() {
    return await this.commodityService.getCommoditySocketData();
  }
}
