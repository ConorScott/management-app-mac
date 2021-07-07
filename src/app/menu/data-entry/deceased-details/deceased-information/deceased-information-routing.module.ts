import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeceasedInformationPage } from './deceased-information.page';

const routes: Routes = [
  {
    path: '',
    component: DeceasedInformationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeceasedInformationPageRoutingModule {}
