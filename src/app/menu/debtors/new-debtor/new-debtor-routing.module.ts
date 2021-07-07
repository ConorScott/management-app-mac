import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewDebtorPage } from './new-debtor.page';

const routes: Routes = [
  {
    path: '',
    component: NewDebtorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewDebtorPageRoutingModule {}
