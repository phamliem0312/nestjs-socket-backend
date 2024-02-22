import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { CacheModule } from '@nestjs/cache-manager';
import { VnStockTickModule } from 'src/core/models/vn_stock_ticks/vn-stock-tick.module';

@Module({
  imports: [VnStockTickModule, CacheModule.register()],
  providers: [EventGateway],
})
export class EventModule {}
