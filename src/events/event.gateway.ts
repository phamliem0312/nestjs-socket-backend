import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { EventService } from './event.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import * as fs from 'fs';
import * as path from 'path';
type Tick = {
  symbol: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  time: number;
  datetime: Date;
  resolution: string;
};

@WebSocketGateway(3006)
export class EventGateway {
  @WebSocketServer() server: Server;
  private readonly cryptoExchanges = ['binance'];
  private readonly resolutions = [
    '1',
    '5',
    '10',
    '15',
    '30',
    '60',
    '240',
    '1D',
    '1W',
    '1M',
  ];
  private logger: Logger = new Logger('EventGateway');
  private readonly intervalTime: number = 1000;
  constructor(
    private readonly eventService: EventService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  afterInit() {
    this.logger.log('Initialized');

    this.initIntervalTimerForCommodity();
  }

  async handleConnection(client: Socket) {
    client.emit('connected');
  }

  async handleDisconnect(client: Socket) {
    const rooms = client.rooms;

    this.leaveAllRooms(client, rooms);
  }

  @SubscribeMessage('subscribe')
  async handleSubscribe(
    client: Socket,
    eventData: {
      subscriberUID: string;
      exchange: string;
      symbol: string;
      resolution: string;
    },
  ) {
    const exchange = eventData.exchange ?? null;
    const symbolCode = eventData.symbol ?? null;
    const resolution = eventData.resolution ?? null;
    const room = eventData.subscriberUID;

    client.join(room);

    const cachedData = await this.cacheManager.get(room);

    if (!cachedData && this.cryptoExchanges.includes(exchange)) {
      this.initIntervalTimer(room, {
        symbolCode,
        resolution,
      });
    }
  }

  @SubscribeMessage('unsubscribe')
  async handleUnsubscribe(
    client: Socket,
    eventData: { subscriberUID: string },
  ) {
    const room = eventData.subscriberUID;

    client.leave(room);
  }

  @SubscribeMessage('subscribe-service')
  async handleSubscribeByService(
    client: Socket,
    eventData: {
      serviceId: string;
    },
  ) {
    const serviceId = eventData.serviceId ?? null;
    const room = eventData.serviceId;

    client.join(room);

    const cachedData = await this.cacheManager.get(room);

    if (cachedData) {
      return;
    }

    if (serviceId === 'crypto') {
      const filePath = path.join(
        process.cwd(),
        './src/data/symbols/crypto.json',
      );
      const configFile = fs.readFileSync(filePath, 'utf-8').toString();
      const symbolList = JSON.parse(configFile);

      const initInterval = (symbolList: Array<any>) => {
        const data = {};
        const max = this.resolutions.length;

        this.resolutions.forEach(async (resolution: string, i: number) => {
          const rawData =
            await this.eventService.getSocketDataByResolution(resolution);
          data[resolution] = [];

          rawData.forEach((row: Tick) => {
            if (symbolList.includes(row.symbol)) {
              data[resolution].push(row);
            }
          });

          if (i === max - 1) {
            await this.cacheManager.set(room, true);
            this.emitRoomData(room, data);

            setTimeout(() => {
              initInterval(symbolList);
            }, this.intervalTime);
          }
        });
      };

      initInterval(symbolList);
    }

    if (serviceId === 'vnstock') {
      const filePath = path.join(
        process.cwd(),
        './src/data/symbols/vnstock.json',
      );
      const configFile = fs.readFileSync(filePath, 'utf-8').toString();
      const symbolList = JSON.parse(configFile);
      this.resolutions.forEach((resolution: string) => {
        symbolList.forEach((symbolCode: string) => {
          const roomName = symbolCode + '_#_' + resolution;

          client.join(roomName);
        });
      });
    }

    if (serviceId === 'commodity') {
      client.join('commodity');
    }
  }

  @SubscribeMessage('unsubscribe-service')
  async handleUnsubscribeBySerice(
    client: Socket,
    eventData: { serviceId: string },
  ) {
    if (eventData.serviceId === 'crypto') {
      const room = eventData.serviceId;
      client.leave(room);
    }
    if (eventData.serviceId === 'commodity') {
      const room = eventData.serviceId;
      client.leave(room);
    }

    if (eventData.serviceId === 'vnstock') {
      const filePath = path.join(
        process.cwd(),
        './src/data/symbols/vnstock.json',
      );
      const configFile = fs.readFileSync(filePath, 'utf-8').toString();
      const symbolList = JSON.parse(configFile);
      this.resolutions.forEach((resolution: string) => {
        symbolList.forEach((symbolCode: string) => {
          const roomName = symbolCode + '_#_' + resolution;
          client.leave(roomName);
        });
      });
    }
  }

  initIntervalTimer(
    room: string,
    params: {
      symbolCode: string;
      resolution: string;
    },
  ) {
    setInterval(async () => {
      const data = await this.eventService.getSocketDataBySymbol(
        params.symbolCode,
        params.resolution,
      );
      this.cacheManager.set(room, true);
      if (data.open === 0) {
        return;
      }
      this.emitRoomData(room, data);
    }, this.intervalTime);
  }

  initIntervalTimerForCommodity() {
    setInterval(async () => {
      const list = await this.eventService.getCommoditySocketData();
      const total = list.length;
      const array = [];

      list.forEach(async (tick: any, i: number) => {
        const room = tick.symbol + '_#_' + tick.resolution;

        if (tick.open === 0) {
          return;
        }
        const cachedData = await this.cacheManager.get(room);
        if (cachedData && JSON.stringify(cachedData) === JSON.stringify(tick)) {
          return;
        }
        this.cacheManager.set(room, tick);

        array.push(tick);

        if (i === total - 1) {
          this.emitRoomData('commodity', array);
        }

        this.emitRoomData(room, tick);
      });
    }, this.intervalTime);
  }

  emitRoomData(room: string, data: object) {
    this.server.to(room).emit('message', data);
  }

  leaveAllRooms(client: Socket, rooms) {
    rooms.forEach((room: string) => {
      client.leave(room);
    });
  }
}
