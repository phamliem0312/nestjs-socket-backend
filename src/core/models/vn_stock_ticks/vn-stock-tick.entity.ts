import { IVnStockTickInterface } from './interfaces/vn-stock-tick.interface';

export class VnStockTickInterface implements IVnStockTickInterface {
  date: Date;
  symbol: string;
  open: number;
  high: number;
  low: number;
  last: number;
  close: number;
  volume: number;
  totalVol: number;
}
