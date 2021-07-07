import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoiceLayoutPage } from './invoice-layout.page';

const routes: Routes = [
  {
    path: '',
    component: InvoiceLayoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceLayoutPageRoutingModule {}
