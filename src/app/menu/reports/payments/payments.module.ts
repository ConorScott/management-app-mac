import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentsPageRoutingModule } from './payments-routing.module';

import { PaymentsPage } from './payments.page';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { EditPaymentModalPage } from 'src/app/shared/edit-payment-modal/edit-payment-modal.page';
import { ViewPaymentPage } from './view-payment/view-payment.page';
import { ReceiptLayoutPage } from '../receipts/receipt-layout/receipt-layout.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentStatsPage } from './payment-stats/payment-stats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentsPageRoutingModule,
    ScrollingModule,
    ReactiveFormsModule
  ],
  declarations: [PaymentsPage, PaymentStatsPage]
})
export class PaymentsPageModule {}
