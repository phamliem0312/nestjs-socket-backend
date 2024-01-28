import { Double, Entity } from 'typeorm';
import { IVnIntraday } from './interfaces/vn-intraday.interface';

@Entity({ name: 'vn_intradays' })
export class VnIntraday implements IVnIntraday {
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
