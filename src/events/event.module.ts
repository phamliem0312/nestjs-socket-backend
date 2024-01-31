import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { CacheModule } from '@nestjs/cache-manager';
import { VnIntradayModule } from 'src/core/models/vn_intradays/vn-intraday.module';

@Module({
  imports: [VnIntradayModule, CacheModule.register()],
  providers: [EventGateway],
})
export class EventModule {}
