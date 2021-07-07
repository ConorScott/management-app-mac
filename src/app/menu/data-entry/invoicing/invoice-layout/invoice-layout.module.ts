import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoiceLayoutPageRoutingModule } from './invoice-layout-routing.module';

import { InvoiceLayoutPage } from './invoice-layout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoiceLayoutPageRoutingModule
  ],
  declarations: []
})
export class InvoiceLayoutPageModule {}
