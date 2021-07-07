import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoicingPageRoutingModule } from './invoicing-routing.module';

import { InvoicingPage } from './invoicing.page';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoicingPageRoutingModule,
    ScrollingModule
  ],
  declarations: [InvoicingPage]
})
export class InvoicingPageModule {}
