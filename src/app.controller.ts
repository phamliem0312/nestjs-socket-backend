import { Controller, Get, Request, Logger, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('index')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getHello(@Request() req): string {
    return this.appService.getHello();
  }
}
