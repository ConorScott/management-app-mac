import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewCoffinPage } from './new-coffin.page';

const routes: Routes = [
  {
    path: '',
    component: NewCoffinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewCoffinPageRoutingModule {}
