import { Injectable } from '@nestjs/common';
import { VnStockTickRepository } from './vn-stock-tick.repository';
import * as moment from 'moment';
@Injectable()
export class VnStockTickService {
  private resolutionDayUnit: string[] = ['D', 'W', 'M'];
  private recordLimit: number = 200;
  constructor(private readonly vnStockTickRepository: VnStockTickRepository) { }

  async getSocketData(symbolCode: string, resolution: string): Promise<any> {
    const barData = await this.getBarByResolution(symbolCode, resolution);
    let isNotMinute = true;

    if (
      resolution.includes('D') ||
      resolution.includes('W') ||
      resolution.includes('M')
    ) {
      isNotMinute = false;
    }

    if (isNotMinute) {
      const resolutionNumber = parseInt(resolution);
      const time = moment
        .unix(moment().unix() - (moment().unix() % (resolutionNumber * 60)))
        .format('YYYY-MM-DD H:mm:ss');
      const diff = moment().diff(barData.time, 'minutes');
      let insidePeriod = false;

      if (diff < resolutionNumber && diff >= 0) {
        insidePeriod = true;
      }

      if (insidePeriod) {
        return {
          symbol: symbolCode,
          open: Math.round(barData.open),
          high: barData.high,
          low: barData.low,
          close: Math.round(barData.close),
          volume: barData.volume,
          time: barData.time,
        };
      }

      return {
        symbol: symbolCode,
        open: Math.round(barData.open),
        high: 0,
        low: 0,
        close: Math.round(barData.close),
        volume: 0,
        time: time,
      };
    }

    if (resolution.includes('D')) {
      const resolutionNumber = parseInt(resolution[0]);
      const diff = moment().diff(barData.time, 'days');
      if (diff < resolutionNumber) {
        return {
          symbol: symbolCode,
          open: barData.open,
          high: barData.high,
          low: barData.low,
          close: barData.close,
          volume: barData.volume,
          time: barData.time,
        };
      }

      return {
        symbol: symbolCode,
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

    if (resolution.includes('M') || resolution.includes('W')) {
      return {
        symbol: symbolCode,
        open: barData.open,
        high: barData.high,
        low: barData.low,
        close: barData.close,
        volume: barData.volume,
        time: barData.time,
      };
    }

    return {};
  }

  async getTickData(symbolCode: string, resolution: string): Promise<any> {
    let data;
    let isNotMinute = true;

    if (
      resolution.includes('D') ||
      resolution.includes('W') ||
      resolution.includes('M')
    ) {
      isNotMinute = false;
    }

    if (!isNotMinute) {
      data = await this.vnStockTickRepository.getTickByMinute(
        symbolCode,
        resolution,
      );
    }

    if (isNotMinute) {
      data = await this.vnStockTickRepository.getTickByDay(
        symbolCode,
        resolution,
      );
    }

    const { open, close } = await this.vnStockTickRepository.getOpenCloseByDate(
      symbolCode,
      data.minDate,
      data.maxDate,
    );

    data.open = open;
    data.close = close;

    return data;
  }

  async getBarByResolution(
    symbolCode: string,
    resolution: string,
  ): Promise<any> {
    const ticks = await this.getTicks(symbolCode, resolution, 1);

    const result = {};

    ticks.forEach((tick) => {
      if (!result[tick.time]) {
        result[tick.time] = {
          time: tick.time,
          open: tick.open,
          high: tick.high,
          low: tick.low,
          volume: tick.volume,
          close: tick.close,
        };
      } else {
        result[tick.time].close = tick.close;
      }
    });

    const bars = Object.values(result);

    return bars[0] ?? {};
  }

  async getBarsByResolution(
    symbolCode: string,
    resolution: string,
  ): Promise<any> {
    const ticks = await this.getTicks(symbolCode, resolution, 1);

    const result = {};

    ticks.forEach((tick) => {
      if (!result[tick.time]) {
        result[tick.time] = {
          time: tick.time,
          open: tick.open,
          high: tick.high,
          low: tick.low,
          volume: tick.volume,
          close: tick.close,
        };
      } else {
        result[tick.time].close = tick.close;
      }
    });

    const bars = Object.values(result);
    const total = bars.length;

    return {
      total: total,
      list: bars,
    };
  }

  async getTicks(symbolCode: string, resolution: string, limit: number = 200) {
    let ticks: Array<any> = [];
    let dataSelect;

    if (
      !resolution.includes('D') &&
      !resolution.includes('W') &&
      !resolution.includes('M')
    ) {
      dataSelect = `from_unixtime(floor(unix_timestamp(DATE)/(${resolution}*60))*(${resolution}*60))`;
    }

    if (resolution.includes('D')) {
      dataSelect = `date_format(DATE, '%Y-%m-%d')`;
    }

    if (resolution.includes('W')) {
      dataSelect = `concat(week(DATE), '-', year(DATE))`;
    }

    if (resolution.includes('M')) {
      const monthPeriod = resolution[0];
      dataSelect = `concat(year(DATE), '-', (floor((month(DATE)-1)/${monthPeriod})*(${monthPeriod}) + 1), '-01')`;
    }

    ticks = await this.vnStockTickRepository.getDataByResolution(
      symbolCode,
      dataSelect,
      limit,
    );

    return ticks;
  }
}
