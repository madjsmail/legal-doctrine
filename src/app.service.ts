import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';
@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  async getCreditCards(): Promise<Observable<any[]>> {

    return this.httpService.get('https://random-data-api.com/api/v2/credit_cards?size=100')
      .pipe(
        map(response => {
          return response.data.map(card => {        
            const {card_number, ...rest} = card;
            return rest; 
          });  
        })
      );
  
  }
  getHello(): string {
    return 'Hello World!';
  }
}
