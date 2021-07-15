import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderPage } from './header/header.page';
import { PopoverComponent } from './popover/popover.component';
import { EditPaymentModalPage } from './edit-payment-modal/edit-payment-modal.page';
import { ViewPaymentModalPage } from './view-payment-modal/view-payment-modal.page';



@NgModule({
  declarations: [
    PaymentModalComponent,
    HeaderPage,
    PopoverComponent,
    EditPaymentModalPage,
    ViewPaymentModalPage
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  exports: [PaymentModalComponent, HeaderPage],
  entryComponents: [PaymentModalComponent]
})
export class SharedModule {}
