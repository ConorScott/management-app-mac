import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiptLayoutPageRoutingModule } from './receipt-layout-routing.module';

import { ReceiptLayoutPage } from './receipt-layout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiptLayoutPageRoutingModule
  ],
  declarations: []
})
export class ReceiptLayoutPageModule {}
