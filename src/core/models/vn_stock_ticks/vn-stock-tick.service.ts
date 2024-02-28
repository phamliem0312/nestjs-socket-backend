import { Injectable } from '@nestjs/common';
import { VnStockTickRepository } from './vn-stock-tick.repository';
import * as moment from 'moment';
@Injectable()
export class VnStockTickService {
  private resolutionDayUnit: string[] = ['D', 'W', 'M'];
  private recordLimit: number = 200;
  constructor(private readonly vnStockTickRepository: VnStockTickRepository) {}

  async getSocketData(symbolCode: string, resolution: string): Promise<any> {
    const isNotMinute =
      resolution.includes('D') ||
      resolution.includes('W') ||
      resolution.includes('M')
        ? true
        : false;
    const tickData = await this.getTickData(symbolCode, resolution);
    if (!isNotMinute) {
      const resolutionNumber = parseInt(resolution);
      const diff = moment().diff(tickData.time, 'minutes');
      let insidePeriod = false;

      if (diff < resolutionNumber && diff >= 0) {
        insidePeriod = true;
      }

      if (insidePeriod) {
        return {
          symbol: symbolCode,
          open: Math.round(tickData.open),
          high: tickData.high,
          low: tickData.low,
          close: Math.round(tickData.close),
          volume: tickData.volume,
          time: tickData.time,
        };
      }

      return {
        symbol: symbolCode,
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
          symbol: symbolCode,
          open: tickData.open,
          high: tickData.high,
          low: tickData.low,
          close: tickData.close,
          volume: tickData.volume,
          time: tickData.time,
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

    if (['1W', '1M'].includes(resolution)) {
      return {
        symbol: symbolCode,
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
    let data;

    const isNotMinute =
      resolution.includes('D') ||
      resolution.includes('W') ||
      resolution.includes('M')
        ? true
        : false;

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

  async getTicksByResolution(
    symbolCode: string,
    resolution: string,
  ): Promise<any> {
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
    );

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

    const list = Object.values(result);
    const total = list.length;

    return {
      total: total,
      list: list,
    };
  }
}
