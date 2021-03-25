import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {  HttpClientModule } from '@angular/common/http';
import { SalesRepresentativeListComponent } from './sales-representative-list/sales-representative-list.component';
import {SalesrepService} from'@shared/salesrep.service';
import { RepOfMonthComponent } from './rep-of-month/rep-of-month.component';
import { DrugOfMonthComponent } from './drug-of-month/drug-of-month.component';
import { WebCoreModule } from 'src/web-core/web-core.module';
import { UrlFormationService } from '@app/url-formation.service';
import {FormsModule } from '@angular/forms';  



@NgModule({
  declarations: [
    AppComponent,
    SalesRepresentativeListComponent,
    RepOfMonthComponent,
    DrugOfMonthComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
   
    WebCoreModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
