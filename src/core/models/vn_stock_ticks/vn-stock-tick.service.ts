import { Injectable } from '@nestjs/common';
import { VnStockTickRepository } from './vn-stock-tick.repository';
import * as moment from 'moment';
@Injectable()
export class VnStockTickService {
  private resolutionMinuteMap: string[] = ['1', '5', '10', '15', '30'];
  private resolutionDayMap: string[] = ['1D', '1W', '1M', '6M'];
  private recordLimit: number = 200;
  constructor(private readonly vnStockTickRepository: VnStockTickRepository) {}

  async getSocketData(symbolCode: string, resolution: string): Promise<any> {
    const tickData = await this.getTickData(symbolCode, resolution);
    if (this.resolutionMinuteMap.includes(resolution)) {
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
    if (this.resolutionMinuteMap.includes(resolution)) {
      return await this.vnStockTickRepository.getTickByMinute(
        symbolCode,
        resolution,
      );
    }

    if (this.resolutionDayMap.includes(resolution)) {
      return await this.vnStockTickRepository.getTicksByDay(
        symbolCode,
        resolution,
      );
    }
  }

  async getTicksByResolution(
    symbolCode: string,
    resolution: string,
  ): Promise<any> {
    let ticks = [];
    let from: string;
    let to: string;
    let data: any[];

    if (this.resolutionMinuteMap.includes(resolution)) {
      const interval = parseInt(resolution);
      const currentMinute = moment().minutes();
      const currentTime = moment().format(
        'YYYY-MM-DD H:' +
          Math.floor(currentMinute / interval) * interval +
          ':00',
      );

      from = moment().format('YYYY-MM-DD 09:00:00');
      to = moment().format('YYYY-MM-DD 15:00:00');

      ticks = await this.vnStockTickRepository.getTicksByMinute(
        symbolCode,
        from,
        to,
      );

      data = this.getDataFromTicks(ticks, currentTime, interval);
    }

    return data;
  }

  getDataFromTicks(ticks: any[], currentTime: string, interval: number) {
    const data = [];
    const tickMap = this.getTickDataMap(ticks);

    for (let i = 1; i <= this.recordLimit; i++) {
      const duration = moment(interval * i, 'minutes');
      const time = moment(currentTime).subtract(duration).format('YYYY-MM-DDTH:mm:ss');

      if (tickMap[time]) {
      }
    }
  }

  getTickDataMap(ticks: any[]) {
    const tickMap = {};

    ticks.forEach((tick) => {
      if (tickMap[tick.time]) {
        tickMap[tick.time] = {
          open: tick.open,
          close: tick.close,
          high: tick.high,
          low: tick.low,
          volume: tick.volume,
        };
      } else {
        tickMap[tick.time].close = tick.close;
        if (tickMap[tick.time].high < tick.high)
          tickMap[tick.time].high = tick.high;
        if (tickMap[tick.time].low > tick.low)
          tickMap[tick.time].low = tick.low;
        tickMap[tick.time].volume += tick.close;
      }
    });

    return tickMap;
  }
}
