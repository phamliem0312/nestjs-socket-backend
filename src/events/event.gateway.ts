import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3006)
export class EventGateway {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventGateway');
  constructor() {}

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
    this.logger.log(payload);

    client.emit('message', {
      msg: 'hello',
    });
  }
}
