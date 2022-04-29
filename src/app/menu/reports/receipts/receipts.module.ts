import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceiptsPageRoutingModule } from './receipts-routing.module';

import { ReceiptsPage } from './receipts.page';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { EditPaymentModalPage } from 'src/app/shared/edit-payment-modal/edit-payment-modal.page';
import { EditReceiptPage } from './edit-receipt/edit-receipt.page';
import { ViewReceiptPage } from './view-receipt/view-receipt.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReceiptLayoutPage } from './receipt-layout/receipt-layout.page';
import { ViewReceiptLayoutPage } from './view-receipt-layout/view-receipt-layout.page';
import { NewReceiptComponent } from './new-receipt/new-receipt.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiptsPageRoutingModule,
    ScrollingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [ReceiptsPage, NewReceiptComponent],
  providers: [DecimalPipe]
})
export class ReceiptsPageModule {}
