import { Component, OnInit } from '@angular/core';
import { SalesRepModel } from '../shared/view-models/sales-rep-model';
import {SalesrepService} from '../shared/salesrep.service';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-sales-representative-list',
  templateUrl: './sales-representative-list.component.html',
  styleUrls: ['./sales-representative-list.component.less']
})
export class SalesRepresentativeListComponent implements OnInit {
  title = 'spm-tutorial';
  operation:String;
  isTrue:boolean=false;
  isEdit:boolean=false;
  isDelete:boolean=false;
  name:String='';
  formdata:SalesRepModel;
  errordata:any={};
  data:SalesRepModel[];
  constructor(private salesRepService:SalesrepService ) { }

  Sname:any;

  ngOnInit() {
    this.salesRepService.getSalesRep().subscribe(res=>{
     
      this.data=res;
      this.Sname=this.data[0].name;
    console.log(this.data);
    });
  }
  onSubmit(){
    if(this.validate()){
    if(this.isEdit){
      this.salesRepService.updateSalesRep(this.formdata).then(res=>{
        this.isTrue=false;
        this.data=this.data.map(d=>d.id==res.id?res:d)
      })
    }else
    this.salesRepService.addSalesRep(this.formdata).then(res=>{
      this.isTrue=false;
      this.data=[...this.data,res]
    })}

}
validate():Boolean{
  this.errordata={}
  if(!this.formdata.name)this.errordata.name='name is required'
  if(!this.formdata.gender)this.errordata.gender='please select gender'
  if(!this.formdata.city)this.errordata.city='city is required'
  if(!this.formdata.country)this.errordata.country='country is required'
  if(!this.formdata.zipcode || (this.formdata.zipcode+'').length!==6 )this.errordata.zipcode='zipcode is required and must be 6 digit'
return Object.keys(this.errordata).length>0?false:true;
}

  openform(){
    this.isTrue=true;
    this.isEdit=false;
    this.formdata=new SalesRepModel();
  }
  cancel(){
    this.isTrue=false;
    this.isDelete=false;
    this.errordata={};
  }

  editsalesrep(d:SalesRepModel){
    this.isTrue=true;
    this.formdata=d;
    this.isEdit=true;
    //alert(JSON.stringify(d))
  }

  deletesalesrep(d:SalesRepModel){
    this.isTrue=true
    this.isDelete=true
    this.formdata=d;

   
  }

  userdelete(){
    let d=this.formdata
    let id:number=d.id;
    
    this.salesRepService.deleteSalesRep(id).then(res=>{
      this.data=this.data.filter(d=>d.id!=id)
    })
    this.formdata=new SalesRepModel()
    this.isTrue=false
    this.isDelete=false
  }
}
