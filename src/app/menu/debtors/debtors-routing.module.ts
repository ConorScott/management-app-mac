import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DebtorsPage } from './debtors.page';

const routes: Routes = [
  {
    path: '',
    component: DebtorsPage
  },
  {
    path: 'new-debtor',
    loadChildren: () => import('./new-debtor/new-debtor.module').then( m => m.NewDebtorPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebtorsPageRoutingModule {}
