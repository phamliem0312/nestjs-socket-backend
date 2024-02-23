import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VnStockTickRepository } from './vn-stock-tick.repository';
import { VnStockTickService } from './vn-stock-tick.service';
import moment from 'moment';

@Module({
  imports: [ConfigModule],
  controllers: [],
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
