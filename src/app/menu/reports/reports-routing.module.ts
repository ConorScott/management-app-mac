import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsPage } from './reports.page';

const routes: Routes = [
  {
    path: '',
    component: ReportsPage,
    children: [
      {
        path:'invoice',
        children: [
          {
            path: '',
            loadChildren: () => import('./invoice/invoice.module').then( m => m.InvoicePageModule)
          }
        ]
      },
      {
        path:'receipt',
        children: [
          {
            path: '',
            loadChildren: () => import('./receipts/receipts.module').then( m => m.ReceiptsPageModule)
          }
        ]
      },


    ]
  },
  // {
  //   path: 'invoice',
  //   loadChildren: () => import('./invoice/invoice.module').then( m => m.InvoicePageModule)
  // },
  // {
  //   path: 'receipt',
  //   loadChildren: () => import('./receipts/receipts.module').then( m => m.ReceiptsPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsPageRoutingModule {}
