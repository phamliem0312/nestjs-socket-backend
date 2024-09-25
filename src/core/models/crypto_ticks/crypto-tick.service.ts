import { Injectable, Inject } from '@nestjs/common';
import { CryptoTickRepository } from './crypto-tick.repository';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import * as moment from 'moment';
@Injectable()
export class CryptoTickService {
  constructor(
    private readonly cryptoTickRepository: CryptoTickRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getSocketDataBySymbol(
    symbolCode: string,
    resolution: string,
  ): Promise<any> {
    const barData = await this.getBarBySymbol(symbolCode, resolution);

    return barData;
  }

  async getSocketDataByResolution(resolution: string): Promise<any> {
    const { fromTime, time } = this.getTimePeriodByResolution(resolution);
    const entityName = this.getEntityNameByResolution(resolution);
    const ticks = await this.cryptoTickRepository.getDataByEntity(
      fromTime,
      entityName,
    );

    const mappingData = {};
    const oldData = await this.cacheManager.get('mappingData');
    const cacheData = {};

    ticks.forEach((tick: any) => {
      if (!cacheData[tick.symbol]) {
        cacheData[tick.symbol] = {
          symbol: tick.symbol,
          open: tick.open ?? 0,
          close: tick.close ?? 0,
          high: tick.high ?? 0,
          low: tick.low ?? 0,
          volume: tick.volume ?? 0,
          time: parseInt(moment(time).format('X')) * 1000,
          datetime: time,
          resolution,
        };

        if (
          !oldData[tick.symbol] ||
          oldData[tick.symbol].volume !== cacheData[tick.symbol].volume
        ) {
          mappingData[tick.symbol] = cacheData[tick.symbol];
        }
      }
    });

    await this.cacheManager.set('mappingData', cacheData);

    const data = Object.values(mappingData) ?? [];

    return data;
  }

  async getBarBySymbol(symbolCode: string, resolution: string): Promise<any> {
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
        time: parseInt(moment(time).format('X')) * 1000,
        datetime: time,
        resolution,
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
    bar.resolution = resolution;

    return bar;
  }

  async getTicks(symbolCode: string, resolution: string) {
    const { fromTime, time } = this.getTimePeriodByResolution(resolution);
    const entityName = this.getEntityNameByResolution(resolution);
    const ticks = await this.cryptoTickRepository.getDataBySymbol(
      symbolCode,
      fromTime,
      entityName,
    );

    return {
      ticks: ticks,
      time: time,
      fromTime: fromTime,
    };
  }

  getTimePeriodByResolution(resolution: string) {
    if (resolution.includes('60')) {
      const time = moment();
      const currentHour = moment().hours();
      const period = 1;
      const hour =
        Math.floor(currentHour / period) * period < 10
          ? '0' + Math.floor(currentHour / period) * period
          : Math.floor(currentHour / period) * period;
      const currentTime = time.format(`YYYY-MM-DD ${hour}:00:00`);
      return {
        time: currentTime,
        fromTime: moment(currentTime).utc().format(`YYYY-MM-DD HH:mm:ss`),
      };
    }

    if (resolution.includes('240')) {
      const time = moment();
      const currentHour = moment().hours();
      const currentUtcHour = moment().utc().hours();
      const period = 4;
      const hour =
        Math.floor(currentHour / period) * period < 10
          ? '0' + Math.floor(currentHour / period) * period
          : Math.floor(currentHour / period) * period;
      const utcHour =
        Math.floor(currentUtcHour / period) * period < 10
          ? '0' + Math.floor(currentUtcHour / period) * period
          : Math.floor(currentUtcHour / period) * period;
      return {
        time: time.format(`YYYY-MM-DD ${hour}:00:00`),
        fromTime: time.utc().format(`YYYY-MM-DD ${utcHour}:00:00`),
      };
    }

    if (resolution.includes('D')) {
      const time = moment();
      const period = parseInt(resolution[0]);
      const currentDay = moment().date();
      const currentUtcDay = moment().utc().date();
      const beginDay =
        Math.floor((currentDay - 1) / period) * period + 1 < 10
          ? '0' + (Math.floor((currentDay - 1) / period) * period + 1)
          : Math.floor((currentDay - 1) / period) * period + 1;
      const beginUtcDay =
        Math.floor((currentUtcDay - 1) / period) * period + 1 < 10
          ? '0' + (Math.floor((currentUtcDay - 1) / period) * period + 1)
          : Math.floor((currentUtcDay - 1) / period) * period + 1;
      return {
        time: time.format(`YYYY-MM-${beginDay} 00:00:00`),
        fromTime: time.utc().format(`YYYY-MM-${beginUtcDay} 00:00:00`),
      };
    }

    if (resolution.includes('W')) {
      const time = moment().isoWeekday(1);
      const period = parseInt(resolution[0]);
      const currentDate = time
        .weekday(8 - period * 7)
        .format('YYYY-MM-DD 00:00:00');
      const beginDate = time
        .utc()
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
      const beginMonth = Math.floor((time.month() + 1) / period) * period;
      const currentDate = time.format(
        `YYYY-${beginMonth < 10 ? '0' + beginMonth : beginMonth}-01 00:00:00`,
      );
      const fromTime = time
        .utc()
        .format(
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
      time: time.format(
        `YYYY-MM-DD HH:${minuteTime > 9 ? minuteTime : '0' + minuteTime}:00`,
      ),
      fromTime: time
        .utc()
        .format(
          `YYYY-MM-DD HH:${minuteTime > 9 ? minuteTime : '0' + minuteTime}:00`,
        ),
    };
  }

  getEntityNameByResolution(resolution: string) {
    const entityMapping = {
      '1': 'crypto_m1s',
      '15': 'crypto_m15s',
      '1h': 'crypto_h1s',
      '4h': 'crypto_h4s',
      d: 'crypto_d1s',
      w: 'crypto_w1s',
    };

    if (resolution.includes('60')) {
      return entityMapping['1h'];
    }

    if (resolution.includes('240')) {
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
