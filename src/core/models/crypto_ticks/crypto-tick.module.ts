import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CryptoTickRepository } from './crypto-tick.repository';
import { CryptoTickService } from './crypto-tick.service';
import { CryptoTickController } from './crypto-tick.controller';
import { CacheModule } from '@nestjs/cache-manager';
import moment from 'moment';

@Module({
  imports: [ConfigModule, CacheModule.register()],
  controllers: [CryptoTickController],
  providers: [
    CryptoTickRepository,
    CryptoTickService,
    ConfigModule,
    {
      provide: 'MomentWrapper',
      useValue: moment,
    },
  ],
  exports: [CryptoTickService],
})
export class CryptoTickModule {}
