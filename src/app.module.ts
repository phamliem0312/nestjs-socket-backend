import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockModule } from './stocks/stock.module';
import { VnIntradayModule } from './core/models/vn_intradays/vn-intraday.module';
import { EventModule } from './events/event.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import config from './core/databases/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
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
