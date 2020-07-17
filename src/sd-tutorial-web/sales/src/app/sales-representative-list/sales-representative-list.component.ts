import { Component, OnInit } from '@angular/core';
import { SalesRepModel } from '../shared/view-models/sales-rep-model';
import {SalesrepService} from '../shared/salesrep.service';
@Component({
  selector: 'app-sales-representative-list',
  templateUrl: './sales-representative-list.component.html',
  styleUrls: ['./sales-representative-list.component.less']
})
export class SalesRepresentativeListComponent implements OnInit {
  title = 'spm-tutorial';
  operation:String;
  data:SalesRepModel[];
  constructor(private salesRepService:SalesrepService ) { }

  ngOnInit() {
    this.salesRepService.getSalesRep().subscribe(res=>{
     
      this.data=res;});
  }
}
