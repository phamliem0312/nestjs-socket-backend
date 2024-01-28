import { Double } from 'typeorm';
import { IVnIntraday } from '../interfaces/vn-intraday.interface';
import { ModelEntity } from 'src/core/models/model.serializer';

export class VnIntradayEntity extends ModelEntity implements IVnIntraday {
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
