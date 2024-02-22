import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VnStockTickRepository } from './vn-stock-tick.repository';
import { VnStockTickService } from './vn-stock-tick.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [VnStockTickRepository, VnStockTickService, ConfigModule],
  exports: [VnStockTickService],
})
export class VnStockTickModule {}
