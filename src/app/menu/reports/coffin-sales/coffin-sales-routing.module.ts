import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoffinSalesPage } from './coffin-sales.page';

const routes: Routes = [
  {
    path: '',
    component: CoffinSalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoffinSalesPageRoutingModule {}
