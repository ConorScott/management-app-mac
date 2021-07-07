import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewCemetryPage } from './new-cemetery.page';

const routes: Routes = [
  {
    path: '',
    component: NewCemetryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewCemetryPageRoutingModule {}
