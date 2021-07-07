import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventCalendarPage } from './event-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: EventCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventCalendarPageRoutingModule {}
