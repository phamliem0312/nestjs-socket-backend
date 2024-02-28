import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VnStockTickRepository } from './vn-stock-tick.repository';
import { VnStockTickService } from './vn-stock-tick.service';
import { VnStockTickController } from './vn-stock-tick.controller';
import moment from 'moment';

@Module({
  imports: [ConfigModule],
  controllers: [VnStockTickController],
  providers: [
    VnStockTickRepository,
    VnStockTickService,
    ConfigModule,
    {
      provide: 'MomentWrapper',
      useValue: moment,
    },
  ],
  exports: [VnStockTickService],
})
export class VnStockTickModule {}
