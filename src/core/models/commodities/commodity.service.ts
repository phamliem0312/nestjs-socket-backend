import { Injectable, Inject } from '@nestjs/common';
import { CommodityRepository } from './commodity.repository';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import * as moment from 'moment';
@Injectable()
export class CommodityService {
  constructor(
    private readonly repository: CommodityRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(resolution: string): Promise<any> {
    const list = await this.repository.findAll(resolution);

    return list;
  }

  async getCommoditySocketData(): Promise<any> {
    const barData = await this.getBars();

    return barData;
  }

  private async getBars(): Promise<any> {
    const ticks = await this.getTicks();

    return ticks;
  }

  private async getTicks() {
    const {
      oneMinuteTime,
      oneMinuteFromTime,
      oneDayTime,
      oneDayFromTime,
      oneHourFromTime,
      oneHourTime,
      fourHourTime,
      fourHourFromTime,
    } = this.getTime();

    const ticks = await this.repository.getAllData([
      oneMinuteFromTime,
      oneMinuteTime,
      oneHourFromTime,
      oneHourTime,
      fourHourFromTime,
      fourHourTime,
      oneDayFromTime,
      oneDayTime,
      parseInt(moment(oneMinuteTime).format('X')) * 1000,
      parseInt(moment(oneHourTime).format('X')) * 1000,
      parseInt(moment(fourHourTime).format('X')) * 1000,
      parseInt(moment(oneDayTime).format('X')) * 1000,
    ]);

    return ticks;
  }

  private getTime() {
    const time = moment();
    const minuteTime = time.minutes();
    const currentHour = moment().hours();
    const currentUtcHour = moment().utc().hours();
    const currentDay = moment().date();
    const currentUtcDay = moment().utc().date();
    const beginDay = currentDay < 10 ? '0' + currentDay : currentDay;
    const beginUtcDay =
      currentUtcDay < 10 ? '0' + currentUtcDay : currentUtcDay;
    const hour1h = currentHour < 10 ? '0' + currentHour : currentHour;
    const minute1m = minuteTime > 9 ? minuteTime : '0' + minuteTime;
    const hour4h =
      Math.floor(currentHour / 4) * 4 < 10
        ? '0' + Math.floor(currentHour / 4) * 4
        : Math.floor(currentHour / 4) * 4;
    const hour4hUtc =
      Math.floor(currentUtcHour / 4) * 4 < 10
        ? '0' + Math.floor(currentUtcHour / 4) * 4
        : Math.floor(currentUtcHour / 4) * 4;

    return {
      oneMinuteTime: moment().format(`YYYY-MM-DD HH:${minute1m}:00`),
      oneMinuteFromTime: moment().utc().format(`YYYY-MM-DD HH:${minute1m}:00`),
      oneHourTime: moment().format(`YYYY-MM-DD ${hour1h}:00:00`),
      oneHourFromTime: moment().utc().format(`YYYY-MM-DD HH:00:00`),
      fourHourTime: moment().format(`YYYY-MM-DD ${hour4h}:00:00`),
      fourHourFromTime: moment().utc().format(`YYYY-MM-DD ${hour4hUtc}:00:00`),
      oneDayTime: moment().format(`YYYY-MM-${beginDay} 00:00:00`),
      oneDayFromTime: moment().utc().format(`YYYY-MM-${beginUtcDay} 00:00:00`),
    };
  }
}
