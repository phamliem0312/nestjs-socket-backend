import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VnStockTickRepository } from './vn-stock-tick.repository';
import { VnIntradayService } from './vn-stock-tick.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [VnStockTickRepository, VnIntradayService, ConfigModule],
  exports: [VnIntradayService],
})
export class VnStockTickModule {}
