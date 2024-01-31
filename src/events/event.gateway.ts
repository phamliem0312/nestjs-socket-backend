import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { VnIntradayService } from 'src/core/models/vn_intradays/vn-intraday.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@WebSocketGateway(3006)
export class EventGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventGateway');
  private readonly intervalTime = 5000;
  private eventData;
  constructor(
    private readonly vnIntradayService: VnIntradayService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket) {
    client.emit('connected');
  }

  async handleDisconnect(client: Socket) {
    client.emit('disconnected');
  }

  @SubscribeMessage('events')
  handleEvent(client: Socket, eventData: { code: string }) {
    this.eventData = eventData;
    this.firstHandleEvent(client, eventData);

    const intervalTimer = setInterval(async () => {
      if (!client.connected) {
        clearInterval(intervalTimer);
      }

      const cachedData = await this.cacheManager.get(this.eventData.code);

      if (cachedData) {
        client.emit('message-' + this.eventData.code, {
          data: cachedData,
        });
        return;
      }
      const data = await this.vnIntradayService.findByCode(this.eventData.code);
      this.cacheManager.set(this.eventData.code, data);

      client.emit('message-' + this.eventData.code, {
        data,
      });
    }, this.intervalTime);

    intervalTimer;
  }

  async firstHandleEvent(client: Socket, eventData) {
    const cachedData = await this.cacheManager.get(eventData.code);

    if (cachedData) {
      client.emit('message-' + eventData.code, {
        data: cachedData,
      });
      return;
    }
    const data = await this.vnIntradayService.findByCode(eventData.code);
    this.cacheManager.set(eventData.code, data, 5);

    client.emit('message-' + eventData.code, {
      data,
    });
  }
}
