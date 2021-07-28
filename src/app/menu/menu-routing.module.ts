import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataEntryPage } from './data-entry/data-entry.page';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: MenuPage,
    children: [
      {
       path: 'data-entry',
       children: [
         {
           path: '',
           loadChildren: () => import('./data-entry/data-entry.module').then(m => m.DataEntryPageModule)
         },

       ]
      },

      {
        path: 'debtors',
        children: [
          {
            path: '',
            loadChildren: () => import('./debtors/debtors.module').then(m => m.DebtorsPageModule)
          },
          {
            path: 'new',
            loadChildren: () => import('./debtors/new-debtor/new-debtor.module').then(m => m.NewDebtorPageModule)
          },
          {
            path: 'edit/:debtorId',
            loadChildren: () => import('./debtors/edit-debtor/edit-debtor.module').then(m => m.EditDebtorPageModule)
          },
          {
            path: 'view/:debtorId',
            loadChildren: () => import('./debtors/debtor-information/debtor-information.module').then( m => m.DebtorInformationPageModule)
          }
        ]
      },
      {
        path: 'coffin-list',
        children: [
          {
            path: '',
            loadChildren: () => import('./coffin-stock/coffin-stock.module').then(m => m.CoffinStockPageModule)
          },
          {
            path: 'new',
            loadChildren: () => import('./coffin-stock/new-coffin/new-coffin.module').then(m => m.NewCoffinPageModule)
          },
        ]
      },
      {
        path: 'reports',
        children: [
          {
            path: '',
            loadChildren: () => import('./reports/reports.module').then(m => m.ReportsPageModule)
          }
        ]
      },
      {
        path: 'calendar',
        children: [
          {
            path: '',
            loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarPageModule)
          },
        ]
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule)
          }
        ]

      },
      {
        path: '',
        redirectTo: '/menu/tabs/debtors',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/menu/tabs/debtors',
    pathMatch: 'full'
  },
  {
    path: 'event-calendar',
    loadChildren: () => import('./event-calendar/event-calendar.module').then( m => m.EventCalendarPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
