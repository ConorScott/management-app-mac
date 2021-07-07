import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditDebtorPage } from './edit-debtor.page';

const routes: Routes = [
  {
    path: '',
    component: EditDebtorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditDebtorPageRoutingModule {}
