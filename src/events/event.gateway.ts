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

    if (cachedData) {
      client.emit('message', cachedData);
    } else {
      this.cacheManager.set(room, {});
      this.initIntervalTimer(room, {
        exchange,
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
      exchange: string;
      symbolCode: string;
      resolution: string;
    },
  ) {
    setInterval(async () => {
      const data = await this.eventService.getSocketData(
        params.exchange,
        params.symbolCode,
        params.resolution,
      );
      this.cacheManager.set(room, data);

      this.server.to(room).emit('message', data);
    }, this.intervalTime);
  }

  leaveAllRooms(client: Socket, rooms) {
    rooms.forEach((room: string) => {
      client.leave(room);
    });
  }
}
