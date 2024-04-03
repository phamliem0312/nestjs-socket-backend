import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { EventService } from './event.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@WebSocketGateway(3006)
export class EventGateway {
  @WebSocketServer() server: Server;
  private readonly cryptoExchanges = ['binance'];
  private logger: Logger = new Logger('EventGateway');
  private readonly intervalTime: number = 1000;
  constructor(
    private readonly eventService: EventService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  afterInit() {
    this.logger.log('Initialized');
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

  initIntervalTimer(
    room: string,
    params: {
      symbolCode: string;
      resolution: string;
    },
  ) {
    setInterval(async () => {
      const data = await this.eventService.getSocketData(
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

  emitRoomData(room: string, data: object) {
    this.server.to(room).emit('message', data);
  }

  leaveAllRooms(client: Socket, rooms) {
    rooms.forEach((room: string) => {
      client.leave(room);
    });
  }
}
