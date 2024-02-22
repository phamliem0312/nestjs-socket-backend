import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { VnStockTickService } from 'src/core/models/vn_stock_ticks/vn-stock-tick.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@WebSocketGateway(3006)
export class EventGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventGateway');
  private readonly intervalTime = 5000;
  constructor(
    private readonly vnStockTickService: VnStockTickService,
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

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, eventData: { channel: string }) {
    const channel = eventData.channel.split('~');
    const intervalTimer = setInterval(async () => {
      if (!client.connected) {
        clearInterval(intervalTimer);
      }

      const cachedData = await this.cacheManager.get(eventData.channel);

      if (cachedData) {
        client.emit('message-' + eventData.channel, {
          data: cachedData,
        });
        return;
      }
      const data = await this.vnStockTickService.findByCode(eventData.channel);
      this.cacheManager.set(eventData.channel, data);

      client.emit('message', {
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
    const data = await this.vnStockTickService.findByCode(eventData.code);
    this.cacheManager.set(eventData.code, data, 5);

    client.emit('message-' + eventData.code, {
      data,
    });
  }
}
