import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewDebtorPageRoutingModule } from './new-debtor-routing.module';

import { NewDebtorPage } from './new-debtor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewDebtorPageRoutingModule
  ],
  declarations: [NewDebtorPage]
})
export class NewDebtorPageModule {}
