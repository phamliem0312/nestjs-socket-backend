import { BadRequestException, Controller, Get, Req } from '@nestjs/common';
import { CryptoTickService } from './crypto-tick.service';
import { Request } from 'express';
@Controller('CryptoTick')
export class CryptoTickController {
  constructor(private readonly cryptoTickService: CryptoTickService) {}

  @Get('/:resolution')
  async getLastBar(@Req() req: Request): Promise<any> {
    const resolution = req.params.resolution;
    return await this.cryptoTickService.getSocketDataByResolution(resolution);
  }
}
