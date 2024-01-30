import { Module } from '@nestjs/common';
import { VnIntradayRepository } from './vn-intraday.repository';
import { VnIntradayService } from './vn-intraday.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [VnIntradayRepository, VnIntradayService, ConfigModule],
  exports: [VnIntradayService],
})
export class VnIntradayModule {}
