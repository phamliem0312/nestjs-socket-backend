import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { CacheModule } from '@nestjs/cache-manager';
import { VnStockTickModule } from 'src/core/models/vn_stock_ticks/vn-stock-tick.module';
import { CryptoTickModule } from 'src/core/models/crypto_ticks/crypto-tick.module';
import { EventService } from './event.service';
@Module({
  imports: [VnStockTickModule, CryptoTickModule, CacheModule.register()],
  providers: [EventGateway, EventService],
})
export class EventModule {}
