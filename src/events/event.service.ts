import { Injectable } from '@nestjs/common';
import { VnStockTickService } from 'src/core/models/vn_stock_ticks/vn-stock-tick.service';
import { CryptoTickService } from 'src/core/models/crypto_ticks/crypto-tick.service';
@Injectable()
export class EventService {
  constructor(
    private readonly vnStockTickService: VnStockTickService,
    private readonly cryptoTickService: CryptoTickService,
  ) {}

  async getSocketData(symbolCode: string, resolution: string) {
    return await this.cryptoTickService.getSocketData(symbolCode, resolution);
  }
}
