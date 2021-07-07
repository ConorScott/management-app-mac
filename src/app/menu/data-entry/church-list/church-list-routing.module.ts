import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChurchListPage } from './church-list.page';

const routes: Routes = [
  {
    path: '',
    component: ChurchListPage
  },
  {
    path: 'new',
    loadChildren: () => import('./new-church/new-church.module').then( m => m.NewChurchPageModule)
  },
  // {
  //   path: 'edit/:churchId',
  //   loadChildren: () => import('./edit-church/edit-church.module').then( m => m.EditChurchPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChurchListPageRoutingModule {}
