import { Controller } from '@nestjs/common';
import { VnStockTickService } from './vn-stock-tick.service';

@Controller()
export class VnStockTickController {
  constructor(private readonly vnStockTickService: VnStockTickService) {}
}
