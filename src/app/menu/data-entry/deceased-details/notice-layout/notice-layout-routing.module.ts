import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoticeLayoutPage } from './notice-layout.page';

const routes: Routes = [
  {
    path: '',
    component: NoticeLayoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoticeLayoutPageRoutingModule {}
