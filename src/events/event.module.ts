import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { VnIntradayModule } from 'src/core/models/vn_intradays/vn-intraday.module';

@Module({
  imports: [VnIntradayModule],
  providers: [EventGateway],
})
export class EventModule {}
