import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import{UrlFormationService} from '../url-formation.service'
import{SalesRepModel} from '../shared/view-models/sales-rep-model'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SalesrepService {

  constructor(private http: HttpClient, private url: UrlFormationService) {}
  getSalesRep(): Observable<SalesRepModel[]> {
    let params = new HttpParams();
    return this.http.get<SalesRepModel[]>(this.url.salesRepUrl())
  }
  addSalesRep(params:SalesRepModel):  Promise<any>{

    return this.http.post<SalesRepModel[]>(this.url.salesRepUrl(),params).toPromise();
  }
  updateSalesRep(params:SalesRepModel): Promise<any> {

    return this.http.put<SalesRepModel[]>(this.url.salesRepUrl(),params).toPromise();
  }
  deleteSalesRep(id:number): Promise<any> {
    return this.http.delete<void>(this.url.deleteSalesRepUrl(id)).toPromise();
  }
}
