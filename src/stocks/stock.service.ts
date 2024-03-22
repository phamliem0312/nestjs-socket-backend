import { ForbiddenException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import FClientConfig from './stock.config';
import { EventGateway } from 'src/events/event.gateway';

@Injectable()
export class StockService {
  private axiosIntance: AxiosInstance;
  private baseUrl: string;
  constructor(private readonly eventGateway: EventGateway) {
    this.baseUrl = FClientConfig.baseUrl;

    this.axiosIntance = axios.create({
      baseURL: this.baseUrl,
      timeout: 60000,
    });
  }

  async getLastBar(id, symbolCode, resolution) {
    const options = {
      params: {
        symbol: symbolCode,
        resolution: resolution,
      },
    };

    const response = await this.getRequest(`tv/${id}/lastbar`, options);

    return {
      success: response.data.success ? true : false,
      data: response.data.data,
    };
  }

  async getHistory(id, params: any) {
    const options = {
      params,
    };

    const response = await this.getRequest(`tv/${id}/history`, options);

    return {
      success: response.data.success ? true : false,
      data: response.data.data,
    };
  }

  async getSymbolData(id, symbolName) {
    const options = {
      params: {
        name: symbolName,
      },
    };

    const response = await this.getRequest(`tv/${id}/symbol`, options);

    return {
      success: response.data.success ? true : false,
      data: response.data.data,
    };
  }

  async getAllSymbol(id, params: any) {
    const options = {
      params,
    };

    const response = await this.getRequest(`tv/${id}/search`, options);

    return {
      success: response.data.success ? true : false,
      data: response.data.data,
    };
  }

  handleWebhookData(data: {
    symbol: string;
    open: number;
    close: number;
    high: number;
    low: number;
    volume: number;
    date: number;
  }) {
    this.eventGateway.emitRoomData(data.symbol, data);
  }

  async getRequest(endpoint: string, options: object) {
    try {
      return await this.axiosIntance.get(endpoint, options);
    } catch (error) {
      throw new ForbiddenException('API not available');
    }
  }
}
