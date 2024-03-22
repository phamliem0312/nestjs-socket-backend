import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { Request } from 'express';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/lastbar/:id')
  async getLastBar(@Req() req: Request): Promise<any> {
    const id = req.params.id;
    const symbol = req.query.symbol;
    const resolution = req.query.resolution;

    if (!id || !symbol || !resolution) {
      throw new BadRequestException('Missing parameter!');
    }
    return await this.stockService.getLastBar(id, symbol, resolution);
  }

  @Get('/history/:id')
  async getHistory(@Req() req: Request): Promise<any> {
    const id = req.params.id;
    const { e, symbol, countBack, resolution } = req.query;

    if (!id || !symbol || !resolution) {
      throw new BadRequestException('Missing parameter!');
    }
    return await this.stockService.getHistory(id, {
      e,
      symbol,
      countBack,
      resolution,
    });
  }

  @Get('/symbol/:id')
  async getSymbolData(@Req() req: Request): Promise<any> {
    const id = req.params.id;
    const name = req.query.name;

    if (!id || !name) {
      throw new BadRequestException('Missing parameter!');
    }
    return await this.stockService.getSymbolData(id, name);
  }

  @Get('/symbols/:id')
  async getAllSymbol(@Req() req: Request): Promise<any> {
    const id = req.params.id;
    const { userInput, exchange, symbolType } = req.query;

    if (!id || !userInput || !exchange || !symbolType) {
      throw new BadRequestException('Missing parameter!');
    }
    return await this.stockService.getHistory(id, {
      userInput,
      exchange,
      symbolType,
    });
  }

  @Post('/webhook')
  async postWebhookData(@Req() req: Request): Promise<any> {
    const webhookData = req.body;

    if (webhookData) {
      throw new BadRequestException('Missing parameter!');
    }
    this.stockService.handleWebhookData(webhookData);

    return true;
  }
}
