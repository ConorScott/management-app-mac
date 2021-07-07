import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditInvoicePageRoutingModule } from './edit-invoice-routing.module';

import { EditInvoicePage } from './edit-invoice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditInvoicePageRoutingModule
  ],
  declarations: [EditInvoicePage]
})
export class EditInvoicePageModule {}
