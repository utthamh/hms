import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZsTextboxComponent } from './zs-textbox/zs-textbox.component';
import { ZsDropdownComponent } from './zs-dropdown/zs-dropdown.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ZsTextboxComponent, ZsDropdownComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ZsTextboxComponent
  ]
})
export class WebCoreModule { }
