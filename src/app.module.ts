import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockModule } from './stocks/stock.module';
import { VnIntradayModule } from './core/models/vn_intradays/vn-intraday.module';
import { EventModule } from './events/event.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import config from './core/databases/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    KnexModule.forRoot({
      config: config[process.env.NODE_ENV ?? 'development'],
    }),
    StockModule,
    VnIntradayModule,
    EventModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
