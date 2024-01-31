import { IVnIntraday } from './interfaces/vn-intraday.interface';

export class VnIntraday implements IVnIntraday {
  code: string;
  floor: string;
  open: number;
  high: number;
  low: number;
  last: number;
  adLast: number;
  accumulatedVal: number;
  accumulatedVol: number;
  lastVol: number;
  side: string;
}
