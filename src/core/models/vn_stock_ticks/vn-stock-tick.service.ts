import { Injectable } from '@nestjs/common';
import { VnStockTickRepository } from './vn-stock-tick.repository';
import * as moment from 'moment';
@Injectable()
export class VnStockTickService {
  private resolutionMap: string[] = ['1', '10', '15', '30', '1D', '1W', '1M'];
  constructor(private readonly vnStockTickRepository: VnStockTickRepository) {}

  async getSocketData(symbolCode: string, resolution: string): Promise<any> {
    const tickList = await this.getTickList(symbolCode, resolution);
    if (resolution == '1') {
      const isCurrent =
        moment().diff(tickList[0].time, 'minutes') == 0 ? true : false;

      if (isCurrent) {
        return {
          symbol: tickList[0].symbol,
          open: tickList[0].open,
          high: tickList[0].high,
          low: tickList[0].low,
          volume: tickList[0].volume,
          time: tickList[0].time,
        };
      }

      return {
        symbol: tickList[0].symbol,
        open: tickList[0].open,
        high: 0,
        low: 0,
        volume: 0,
        time: tickList[0].time,
      };
    }

    return tickList;
  }

  async getTickList(symbolCode: string, resolution: string): Promise<any> {
    if (['1', '10', '15', '30'].includes(resolution)) {
      return await this.vnStockTickRepository.getTicksByMinute(symbolCode);
    }

    if (['1D', '1W', '1M'].includes(resolution)) {
      return await this.vnStockTickRepository.getTicksByDay(symbolCode);
    }
  }
}
