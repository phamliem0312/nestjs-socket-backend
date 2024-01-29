import { Controller, Get, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('index')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Request() req): string {
    return this.appService.getHello();
  }
}
