import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoiceInformationPageRoutingModule } from './invoice-information-routing.module';

import { InvoiceInformationPage } from './invoice-information.page';
import { InvoiceLayoutPage } from '../invoice-layout/invoice-layout.page';
import { NgxPrintModule } from 'ngx-print';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoiceInformationPageRoutingModule,
    NgxPrintModule,
  ],
  declarations: [InvoiceInformationPage, InvoiceLayoutPage],
  providers: [Printer, DecimalPipe]
})
export class InvoiceInformationPageModule {}
