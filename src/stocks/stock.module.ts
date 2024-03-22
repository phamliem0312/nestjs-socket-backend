import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { EventModule } from 'src/events/event.module';

@Module({
  imports: [HttpModule, EventModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
