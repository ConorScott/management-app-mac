import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoicingPage } from './invoicing.page';

const routes: Routes = [
  {
    path: '',
    component: InvoicingPage
  },
  {
    path: 'invoice-layout',
    loadChildren: () => import('./invoice-layout/invoice-layout.module').then( m => m.InvoiceLayoutPageModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicingPageRoutingModule {}
