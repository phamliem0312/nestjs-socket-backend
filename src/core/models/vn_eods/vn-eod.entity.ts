import { IVnEod } from './interfaces/vn-eod.interface';

export class VnEodEntity implements IVnEod {
  symbol: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  openint: number;
}
