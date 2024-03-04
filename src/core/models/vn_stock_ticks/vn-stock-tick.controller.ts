import { Controller, Get, Query, Req } from '@nestjs/common';
import { VnStockTickService } from './vn-stock-tick.service';
import { Request } from 'express';

@Controller()
export class VnStockTickController {
  constructor(private readonly vnStockTickService: VnStockTickService) {}
}
