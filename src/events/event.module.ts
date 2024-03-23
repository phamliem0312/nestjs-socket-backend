import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';
import { CacheModule } from '@nestjs/cache-manager';
import { CryptoTickModule } from 'src/core/models/crypto_ticks/crypto-tick.module';
import { EventService } from './event.service';
@Module({
  imports: [CryptoTickModule, CacheModule.register()],
  providers: [EventGateway, EventService],
  exports: [EventGateway],
})
export class EventModule {}
