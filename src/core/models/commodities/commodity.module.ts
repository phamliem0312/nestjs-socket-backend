import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommodityRepository } from './commodity.repository';
import { CommodityController } from './commodity.controller';
import { CommodityService } from './commodity.service';
import { CacheModule } from '@nestjs/cache-manager';
import moment from 'moment';

@Module({
  imports: [ConfigModule, CacheModule.register()],
  controllers: [CommodityController],
  providers: [
    CommodityRepository,
    CommodityService,
    ConfigModule,
    {
      provide: 'MomentWrapper',
      useValue: moment,
    },
  ],
  exports: [CommodityService],
})
export class CommodityModule {}
