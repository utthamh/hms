import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UrlFormationService {

  constructor() { }
  baseUrl: string = environment.baseUrl;
  salesRepUrl() {
    return `${this.baseUrl}/salesrep`
  }
  deleteSalesRepUrl(id:number) {
    return `${this.baseUrl}/salesrep/${id}`
  }
}
