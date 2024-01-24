import { Controller, Get } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('api/v1/stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('history')
  getHello(): string {
    return this.stockService.getHistory();
  }
}
