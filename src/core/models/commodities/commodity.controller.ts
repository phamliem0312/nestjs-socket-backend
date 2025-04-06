import { Controller, Get, Param } from '@nestjs/common';
import { CommodityService } from './commodity.service';

@Controller('Commodity')
export class CommodityController {
  constructor(private readonly commodityService: CommodityService) {}
  @Get('/findAll/:resolution')
  async findAll(@Param() params): Promise<any> {
    return await this.commodityService.findAll(params.resolution);
  }
  @Get('/getCurrentData')
  async getCurrentData(): Promise<any> {
    return await this.commodityService.getCommoditySocketData();
  }
}
