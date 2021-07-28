import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiptLayoutPage } from './receipt-layout.page';

const routes: Routes = [
  {
    path: '',
    component: ReceiptLayoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptLayoutPageRoutingModule {}
