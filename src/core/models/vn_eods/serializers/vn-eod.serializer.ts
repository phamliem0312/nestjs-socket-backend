import { IVnEod } from '../interfaces/vn-eod.interface';
import { ModelEntity } from 'src/core/models/model.serializer';

export class VnEodEntity extends ModelEntity implements IVnEod {
  symbol: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  openint: number;
}
