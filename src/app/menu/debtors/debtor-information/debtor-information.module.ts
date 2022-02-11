import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { DebtorInformationPage } from './debtor-information.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ViewPaymentPage } from '../../reports/payments/view-payment/view-payment.page';
import { ReceiptLayoutPage } from '../../reports/receipts/receipt-layout/receipt-layout.page';
import { PaymentsPageModule } from '../../reports/payments/payments.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

const routes: Routes = [
  {
    path: '',
    component: DebtorInformationPage
  },

];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SharedModule,
        ScrollingModule
    ],
    declarations: [DebtorInformationPage]
})
export class DebtorInformationPageModule {}
