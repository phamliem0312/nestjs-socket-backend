import { IVnIntraday } from '../interfaces/vn-intraday.interface';
import { ModelEntity } from 'src/core/models/model.serializer';

export class VnIntradayEntity extends ModelEntity implements IVnIntraday {
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
