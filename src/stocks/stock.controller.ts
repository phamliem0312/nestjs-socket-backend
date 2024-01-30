import { BadRequestException, Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { StockService } from './stock.service';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/history/:id')
  async getHistory(@Req() req: Request): Promise<any> {
    const id = req.params.id;

    if (!id) {
      throw new BadRequestException('Missing parameter id');
    }
    return await this.stockService.getHistory(id);
  }
}
