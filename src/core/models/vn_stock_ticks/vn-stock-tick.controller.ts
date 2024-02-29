import { Controller, Get, Query, Req } from '@nestjs/common';
import { VnStockTickService } from './vn-stock-tick.service';
import { Request } from 'express';

@Controller()
export class VnStockTickController {
  constructor(private readonly vnStockTickService: VnStockTickService) {}

  @Get('vnstocktick/:symbol')
  getVnTickDataBySymbol(@Req() req: Request) {
    const symbol = req.params.symbol;
    const resolution = req.query.resolution.toString();

    return this.vnStockTickService.getBarsByResolution(symbol, resolution);
  }
}
