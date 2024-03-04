import { ForbiddenException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import FClientConfig from './stock.config';

@Injectable()
export class StockService {
  private axiosIntance: AxiosInstance;
  private baseUrl: string;
  constructor() {
    this.baseUrl = FClientConfig.baseUrl;

    this.axiosIntance = axios.create({
      baseURL: this.baseUrl,
      timeout: 60000,
    });
  }

  async getLastBar(symbolCode, resolution) {
    const options = {
      params: {
        symbol: symbolCode,
        resolution: resolution,
      },
    };

    const response = await this.getRequest('tv/1/lastbar', options);

    return {
      data: response.data,
    };
  }

  async getRequest(endpoint: string, options: object) {
    try {
      return await this.axiosIntance.get(endpoint, options);
    } catch (error) {
      throw new ForbiddenException('API not available');
    }
  }
}
