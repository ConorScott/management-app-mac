import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsPage } from './reports.page';

const routes: Routes = [
  {
    path: '',
    component: ReportsPage,
    children: [
      {
        path: 'payments',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./payments/payments.module').then(
                (m) => m.PaymentsPageModule
              ),
          },
        ],
      },
      {
        path: 'receipt',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./receipts/receipts.module').then(
                (m) => m.ReceiptsPageModule
              ),
          },
        ],
      },
      {
        path: 'donation',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./donations/donations.module').then(
                (m) => m.DonationsPageModule
              ),
          },
        ],
      },
      {
        path: 'coffin-sales',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./coffin-sales/coffin-sales.module').then(
                (m) => m.CoffinSalesPageModule
              ),
          },
        ],
      },
      {
        path: 'cashbook',
        children: [
          {
            path: '',
            loadChildren: () => import('./cashbook/cashbook.module').then( m => m.CashbookPageModule)
          },
        ],
      },
      {
        path: '',
        redirectTo: '/menu/tabs/reports/payments',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/menu/tabs/reports/payments',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsPageRoutingModule {}
