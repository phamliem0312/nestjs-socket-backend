import { Injectable } from '@nestjs/common';
import { VnStockTickService } from 'src/core/models/vn_stock_ticks/vn-stock-tick.service';
import { CryptoTickService } from 'src/core/models/crypto_ticks/crypto-tick.service';
@Injectable()
export class EventService {
  private readonly cryptoExchanges = ['binance'];
  constructor(
    private readonly vnStockTickService: VnStockTickService,
    private readonly cryptoTickService: CryptoTickService,
  ) {}

  async getSocketData(
    exchange: string,
    symbolCode: string,
    resolution: string,
  ) {
    if (this.cryptoExchanges.includes(exchange)) {
      return await this.cryptoTickService.getSocketData(symbolCode, resolution);
    }

    return await this.vnStockTickService.getSocketData(symbolCode, resolution);
  }
}
