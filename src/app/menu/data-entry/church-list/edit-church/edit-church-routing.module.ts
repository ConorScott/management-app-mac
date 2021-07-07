import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditChurchPage } from './edit-church.page';

const routes: Routes = [
  {
    path: '',
    component: EditChurchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditChurchPageRoutingModule {}
