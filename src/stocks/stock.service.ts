import { Injectable } from '@nestjs/common';

@Injectable()
export class StockService {
  getHistory(): string {
    return 'Histories!';
  }
}
