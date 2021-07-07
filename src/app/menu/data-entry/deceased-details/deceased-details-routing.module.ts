import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeceasedDetailsPage } from './deceased-details.page';

const routes: Routes = [
  {
    path: '',
    component: DeceasedDetailsPage,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeceasedDetailsPageRoutingModule {}
