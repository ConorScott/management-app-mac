import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarPage } from './calendar.page';

const routes: Routes = [
  {
    path: '',
    component: CalendarPage
  },
  {
    path: 'new-entry',
    loadChildren: () => import('./new-entry/new-entry.module').then( m => m.NewEntryPageModule)
  },
  // {
  //   path: 'cal-moda',
  //   loadChildren: () => import('./cal-modal/cal-modal.module').then( m => m.CalModalPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarPageRoutingModule {}
