import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditCemetryPage } from './edit-cemetery.page';

const routes: Routes = [
  {
    path: '',
    component: EditCemetryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditCemetryPageRoutingModule {}
