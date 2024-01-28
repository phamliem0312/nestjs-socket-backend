import { Double } from 'typeorm';

export interface IVnIntraday {
  code: string;
  floor: string;
  open: Double;
  high: Double;
  low: Double;
  last: Double;
  adLast: Double;
  accumulatedVal: Double;
  accumulatedVol: Double;
  lastVol: Double;
  side: string;
}
