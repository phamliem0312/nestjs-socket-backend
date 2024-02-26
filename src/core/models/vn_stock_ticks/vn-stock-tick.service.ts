import { Injectable } from '@nestjs/common';
import { VnStockTickRepository } from './vn-stock-tick.repository';
import * as moment from 'moment';
@Injectable()
export class VnStockTickService {
  private resolutionMap: string[] = ['1', '10', '15', '30', '1D', '1W', '1M'];
  constructor(private readonly vnStockTickRepository: VnStockTickRepository) {}

  async getSocketData(symbolCode: string, resolution: string): Promise<any> {
    const tickData = await this.getTickData(symbolCode, resolution);
    if (['1', '10', '15', '30'].includes(resolution)) {
      const resolutionNumber = parseInt(resolution);
      const diff = moment().diff(tickData.time, 'minutes');
      let insidePeriod = false;

      if (diff < resolutionNumber && diff >= 0) {
        insidePeriod = true;
      }

      if (insidePeriod) {
        return {
          symbol: tickData.symbol,
          open: Math.round(tickData.open),
          high: tickData.high,
          low: tickData.low,
          close: Math.round(tickData.close),
          volume: tickData.volume,
          time: tickData.time,
        };
      }

      return {
        symbol: tickData.symbol,
        open: Math.round(tickData.open),
        high: 0,
        low: 0,
        close: Math.round(tickData.close),
        volume: 0,
        time: moment
          .unix(moment().unix() - (moment().unix() % (resolutionNumber * 60)))
          .format('YYYY-MM-DD hh:mm:ss'),
      };
    }

    if (resolution == '1D') {
      const resolutionNumber = parseInt(resolution);
      const diff = moment().diff(tickData.time, 'days');
      if (diff == 0) {
        return {
          symbol: tickData.symbol,
          open: tickData.open,
          high: tickData.high,
          low: tickData.low,
          close: tickData.close,
          volume: tickData.volume,
          time: tickData.time,
        };
      }

      return {
        symbol: 0,
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volume: 0,
        time: moment
          .unix(moment().unix() - (moment().unix() % (resolutionNumber * 60)))
          .format('YYYY-MM-DD'),
      };
    }

    if (['1W', '1M'].includes(resolution)) {
      return {
        symbol: tickData.symbol,
        open: tickData.open,
        high: tickData.high,
        low: tickData.low,
        close: tickData.close,
        volume: tickData.volume,
        time: tickData.time,
      };
    }

    return {};
  }

  async getTickData(symbolCode: string, resolution: string): Promise<any> {
    if (['1', '10', '15', '30'].includes(resolution)) {
      return await this.vnStockTickRepository.getTickByMinute(
        symbolCode,
        resolution,
      );
    }

    if (['1D', '1W', '1M'].includes(resolution)) {
      return await this.vnStockTickRepository.getTicksByDay(
        symbolCode,
        resolution,
      );
    }
  }
}
