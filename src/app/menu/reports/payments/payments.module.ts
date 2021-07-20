import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentsPageRoutingModule } from './payments-routing.module';

import { PaymentsPage } from './payments.page';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { EditPaymentModalPage } from 'src/app/shared/edit-payment-modal/edit-payment-modal.page';
import { ViewPaymentPage } from './view-payment/view-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentsPageRoutingModule,
    ScrollingModule
  ],
  declarations: [PaymentsPage, ViewPaymentPage]
})
export class PaymentsPageModule {}
