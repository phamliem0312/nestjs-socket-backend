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
  async handleSubscribe(
    client: Socket,
    eventData: { symbol: string; resolution: string },
  ) {
    const symbolCode = eventData.symbol ?? null;
    const resolution = eventData.resolution ?? null;
    const room = `${symbolCode}-${resolution}`;

    const cachedData = await this.cacheManager.get(room);

    if (cachedData) {
      client.emit('message', cachedData);
    }

    const intervalTimer = setInterval(async () => {
      if (client.disconnected) {
        clearInterval(intervalTimer);
      }
      const cachedData = await this.cacheManager.get(room);

      if (cachedData) {
        client.emit('message', cachedData);
        return;
      }
      const data = await this.vnStockTickService.getSocketData(
        symbolCode,
        resolution,
      );
      this.cacheManager.set(room, data);

      client.emit('message', data);
    }, this.intervalTime);

    intervalTimer;
  }
}
