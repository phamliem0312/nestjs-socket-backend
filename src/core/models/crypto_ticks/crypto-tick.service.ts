import { Injectable } from '@nestjs/common';
import { CryptoTickRepository } from './crypto-tick.repository';
import * as moment from 'moment';
@Injectable()
export class CryptoTickService {
  constructor(private readonly cryptoTickRepository: CryptoTickRepository) {}

  async getSocketData(symbolCode: string, resolution: string): Promise<any> {
    const barData = await this.getBarByResolution(symbolCode, resolution);

    return barData;
  }

  async getBarByResolution(
    symbolCode: string,
    resolution: string,
  ): Promise<any> {
    const { ticks, time } = await this.getTicks(symbolCode, resolution);
    const tickTotal = ticks.length;

    if (tickTotal === 0) {
      return {
        symbol: symbolCode,
        open: 0,
        close: 0,
        high: 0,
        low: 0,
        volume: 0,
      };
    }

    const bar = ticks[tickTotal - 1];

    bar.datetime = time;
    bar.time = parseInt(moment(time).format('X')) * 1000;
    bar.open = bar.open ?? 0;
    bar.high = bar.high ?? 0;
    bar.low = bar.low ?? 0;
    bar.close = bar.close;
    bar.volume = bar.volume;

    return bar;
  }

  async getTicks(symbolCode: string, resolution: string) {
    const { fromTime, toTime, time } =
      this.getTimePeriodByResolution(resolution);
    const ticks = await this.cryptoTickRepository.getDataByResolution(
      symbolCode,
      fromTime,
      toTime,
    );

    return { ticks: ticks, time: time };
  }

  getTimePeriodByResolution(resolution: string) {
    if (resolution.includes('h')) {
      const time = moment();
      const currentHour = moment().hours();
      const period = parseInt(resolution[0]);
      const hour =
        Math.floor(currentHour / period) * period < 10
          ? '0' + Math.floor(currentHour / period) * period
          : Math.floor(currentHour / period) * period;
      return {
        fromTime: time.format(`YYYY-MM-DD ${hour}:00:00`),
        toTime: time.format(`YYYY-MM-DD H:mm:ss`),
        time: time.format(`YYYY-MM-DD ${hour}:00:00`),
      };
    }

    if (resolution.includes('D')) {
      const time = moment();
      const period = parseInt(resolution[0]);
      const currentDay = time.date();
      const beginDay =
        Math.floor((currentDay - 1) / period) * period + 1 < 10
          ? '0' + (Math.floor((currentDay - 1) / period) * period + 1)
          : Math.floor((currentDay - 1) / period) * period + 1;
      return {
        fromTime: time.format(`YYYY-MM-${beginDay} 00:00:00`),
        toTime: time.format('YYYY-MM-DD 23:59:59'),
        time: time.format(`YYYY-MM-${beginDay} 00:00:00`),
      };
    }

    if (resolution.includes('W')) {
      const time = moment().isoWeekday(1);
      const period = parseInt(resolution[0]);
      const beginDate = time
        .weekday(8 - period * 7)
        .format('YYYY-MM-DD 00:00:00');
      const currentDate = time
        .weekday(8 - period * 7)
        .format('YYYY-MM-DD 00:00:00');
      return {
        fromTime: beginDate,
        toTime: time.format('YYYY-MM-DD 23:59:59'),
        time: currentDate,
      };
    }

    if (resolution.includes('M')) {
      const time = moment();
      const period = parseInt(resolution[0]);
      const beginMonth = Math.floor((time.months() + 1) / period) * period;
      const fromTime = time.format(
        `YYYY-${beginMonth < 10 ? '0' + beginMonth : beginMonth}-01 00:00:00`,
      );
      const currentDate = time.format(
        `YYYY-${beginMonth < 10 ? '0' + beginMonth : beginMonth}-01 00:00:00`,
      );
      return {
        fromTime: fromTime,
        toTime: time.format('YYYY-MM-DD 23:59:59'),
        time: currentDate,
      };
    }

    const currentMinute = moment().minutes();
    const resolutionNumber = parseInt(resolution);

    return {
      fromTime: moment().format(
        `YYYY-MM-DD H:${Math.floor(currentMinute / resolutionNumber) * resolutionNumber}:00`,
      ),
      toTime: moment().format('YYYY-MM-DD H:mm:ss'),
      time: moment().format(
        `YYYY-MM-DD H:${Math.floor(currentMinute / resolutionNumber) * resolutionNumber}:00`,
      ),
    };
  }
}
