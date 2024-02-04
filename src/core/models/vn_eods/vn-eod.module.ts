import { Module } from '@nestjs/common';
import { VnEodRepository } from './vn-eod.repository';
import { VnEodService } from './vn-eod.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [VnEodRepository, VnEodService, ConfigModule],
  exports: [VnEodService],
})
export class VnEodModule {}
