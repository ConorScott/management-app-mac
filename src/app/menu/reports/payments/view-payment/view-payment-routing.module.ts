import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewPaymentPage } from './view-payment.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPaymentPageRoutingModule {}
