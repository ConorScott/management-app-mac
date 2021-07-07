import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoffinStockPage } from './coffin-stock.page';

const routes: Routes = [
  {
    path: '',
    component: CoffinStockPage
  },
  {
    path: 'new-coffin',
    loadChildren: () => import('./new-coffin/new-coffin.module').then( m => m.NewCoffinPageModule)
  },
  {
    path: 'edit/:coffinId',
    loadChildren: () => import('./edit-coffin/edit-coffin.module').then( m => m.EditCoffinPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoffinStockPageRoutingModule {}
