import {
  Controller,
  Get,
  Request,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('api/v1/stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/history/:id')
  getHistory(@Request() req): string {
    console.log(req.param);
    console.log(req.query);
    return this.stockService.getHistory();
  }

  throwMessageNotFound(stock) {
    if (stock) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}
