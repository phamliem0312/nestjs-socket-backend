import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('index')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getIndex(): string {
    return 'Welcome to Socket Server.';
  }
}
