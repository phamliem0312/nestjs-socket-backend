import { Injectable } from '@nestjs/common';
import { CryptoTickService } from 'src/core/models/crypto_ticks/crypto-tick.service';
@Injectable()
export class EventService {
  constructor(private readonly cryptoTickService: CryptoTickService) {}

  async getSocketDataBySymbol(symbolCode: string, resolution: string) {
    return await this.cryptoTickService.getSocketDataBySymbol(
      symbolCode,
      resolution,
    );
  }

  async getSocketDataByResolution(resolution: string) {
    return await this.cryptoTickService.getSocketDataByResolution(resolution);
  }
}
