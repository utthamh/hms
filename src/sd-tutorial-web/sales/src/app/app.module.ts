import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SalesRepresentativeListComponent } from './sales-representative-list/sales-representative-list.component';
import { RepOfMonthComponent } from './rep-of-month/rep-of-month.component';
import { DrugOfMonthComponent } from './drug-of-month/drug-of-month.component';
import { WebCoreModule } from 'src/web-core/web-core.module';



@NgModule({
  declarations: [
    AppComponent,
    SalesRepresentativeListComponent,
    RepOfMonthComponent,
    DrugOfMonthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebCoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
