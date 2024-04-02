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
    bar.close = bar.close ?? 0;
    bar.volume = bar.volume ?? 0;

    return bar;
  }

  async getTicks(symbolCode: string, resolution: string) {
    const { fromTime, time } = this.getTimePeriodByResolution(resolution);
    const entityName = this.getEntityNameByResolution(resolution);
    const ticks = await this.cryptoTickRepository.getDataByEntity(
      symbolCode,
      fromTime,
      entityName,
    );

    return {
      ticks: ticks,
      time: time,
    };
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
        time: time.format(`YYYY-MM-${beginDay} 00:00:00`),
      };
    }

    if (resolution.includes('W')) {
      const time = moment().utc().isoWeekday(1);
      const period = parseInt(resolution[0]);
      const beginDate = time
        .weekday(8 - period * 7)
        .format('YYYY-MM-DD 00:00:00');
      const currentDate = time
        .weekday(8 - period * 7)
        .format('YYYY-MM-DD 00:00:00');
      return {
        fromTime: beginDate,
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
        time: currentDate,
      };
    }

    const time = moment();
    const currentMinute = time.minutes();
    const resolutionNumber = parseInt(resolution);
    const minuteTime =
      Math.floor(currentMinute / resolutionNumber) * resolutionNumber;

    return {
      fromTime: time.format(
        `YYYY-MM-DD HH:${minuteTime > 9 ? minuteTime : '0' + minuteTime}:00`,
      ),
      time: time.format(
        `YYYY-MM-DD HH:${minuteTime > 9 ? minuteTime : '0' + minuteTime}:00`,
      ),
    };
  }

  getEntityNameByResolution(resolution: string) {
    const entityMapping = {
      s: 'crypto_s1s',
      '1': 'crypto_m1s',
      '15': 'crypto_m15s',
      '1h': 'crypto_h1s',
      '4h': 'crypto_h4s',
      d: 'crypto_d1s',
      w: 'crypto_w1s',
    };

    if (resolution.includes('s')) {
      return entityMapping['s'];
    }

    if (resolution.includes('1')) {
      return entityMapping['1'];
    }

    if (resolution.includes('15')) {
      return entityMapping['15'];
    }

    if (resolution.includes('60')) {
      return entityMapping['1h'];
    }

    if (resolution.includes('240')) {
      return entityMapping['4h'];
    }

    if (resolution.includes('4h')) {
      return entityMapping['4h'];
    }

    if (resolution.includes('D')) {
      return entityMapping['d'];
    }

    if (resolution.includes('W')) {
      return entityMapping['w'];
    }

    return entityMapping[resolution] ?? null;
  }
}
