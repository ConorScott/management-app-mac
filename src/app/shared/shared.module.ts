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



@NgModule({
  declarations: [
    PaymentModalComponent,
    HeaderPage,
    PopoverComponent,
    EditPaymentModalPage,
    ViewPaymentModalPage,
    DateRangePage
  ],
  imports: [CommonModule, IonicModule,FormsModule, ReactiveFormsModule],
  exports: [PaymentModalComponent, HeaderPage, DateRangePage],
  entryComponents: [PaymentModalComponent]
})
export class SharedModule {}
