import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { VnIntradayService } from 'src/core/models/vn_intradays/vn-intraday.service';

@WebSocketGateway(3006)
export class EventGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventGateway');
  constructor(private readonly vnIntradayService: VnIntradayService) {}

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.log(client.id, 'Connected........................');

    client.emit('connected');
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(client.id, 'Disconnect');
  }

  @SubscribeMessage('message')
  async message(client: Socket, payload) {
    const data = await this.vnIntradayService.findByCode(payload.code);
    this.logger.log(data);

    client.emit('message', {
      data,
    });
  }
}
