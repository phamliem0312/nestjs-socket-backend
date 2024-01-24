import {
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Namespace } from 'socket.io';

@WebSocketGateway(80, { namespace: 'events' })
export class EventGateway {
  @WebSocketServer() io: Namespace;
  @SubscribeMessage('events')
  handleEvent(@MessageBody('id') id: number): number {
    return id;
  }
}
