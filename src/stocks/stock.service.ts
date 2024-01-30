import { ForbiddenException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import FClientConfig from './stock.config';

@Injectable()
export class StockService {
  private axiosIntance: AxiosInstance;
  private baseUrl: string;
  private token: string;
  constructor() {
    this.baseUrl = FClientConfig.baseUrl;
    this.token = FClientConfig.token;

    this.axiosIntance = axios.create({
      baseURL: this.baseUrl,
      timeout: 60000,
    });
  }

  async getHistory(id: string) {
    const options = {
      params: {
        token: this.token,
        email: 'op1@noibaiconnect.com',
        action: 'getFclientData',
        ids: id,
      },
    };

    const response = await this.getRequest('fapi', options);

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
