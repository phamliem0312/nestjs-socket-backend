import { ForbiddenException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class StockService {
  private axiosIntance;
  private readonly url = 'https://mindthegapstudio.com/';
  private readonly token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im9wMUBub2liYWljb25uZWN0LmNvbSIsImZ1bGxuYW1lIjoiSHV5LUFuaCBOZ3V5ZW4iLCJpYXQiOjE3MDQxODU2MTN9.7P_RIqdVgcEdlQ22Gk80elkDblyJoqB7GH7uq0RuDXU`;
  constructor() {
    this.axiosIntance = axios.create({
      baseURL: this.url,
      timeout: 60000,
    });
  }

  async getHistory() {
    const options = {
      params: {
        token: this.token,
        email: 'op1@noibaiconnect.com',
        action: 'getFclientData',
        ids: '1',
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
