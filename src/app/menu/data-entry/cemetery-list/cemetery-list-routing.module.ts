import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CemetryListPage } from './cemetery-list.page';

const routes: Routes = [
  {
    path: '',
    component: CemetryListPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CemetryListPageRoutingModule {}
