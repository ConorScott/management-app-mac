import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderPage } from './header/header.page';
import { PopoverComponent } from './popover/popover.component';
import { EditPaymentModalPage } from './edit-payment-modal/edit-payment-modal.page';
import { ViewPaymentModalPage } from './view-payment-modal/view-payment-modal.page';
import { DateRangePage } from './date-range/date-range.page';
import { ViewPaymentPage } from '../menu/reports/payments/view-payment/view-payment.page';
import { ReceiptLayoutPage } from '../menu/reports/receipts/receipt-layout/receipt-layout.page';
import { ViewReceiptPage } from '../menu/reports/receipts/view-receipt/view-receipt.page';
import { ViewReceiptLayoutPage } from '../menu/reports/receipts/view-receipt-layout/view-receipt-layout.page';
import { EditReceiptPage } from '../menu/reports/receipts/edit-receipt/edit-receipt.page';
import { BalanceRangePage } from './balance-range/balance-range.page';



@NgModule({
    declarations: [
        PaymentModalComponent,
        HeaderPage,
        PopoverComponent,
        ViewPaymentModalPage,
        DateRangePage,
        ViewPaymentPage,
        ReceiptLayoutPage,
        EditPaymentModalPage,
        ViewReceiptPage,
        ViewReceiptLayoutPage,
        EditReceiptPage,
        BalanceRangePage
    ],
    imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
    exports: [PaymentModalComponent, HeaderPage, DateRangePage, ReceiptLayoutPage, ViewReceiptLayoutPage, BalanceRangePage]
})
export class SharedModule {}
