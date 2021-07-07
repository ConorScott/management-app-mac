import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDebtorPageRoutingModule } from './edit-debtor-routing.module';

import { EditDebtorPage } from './edit-debtor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditDebtorPageRoutingModule
  ],
  declarations: [EditDebtorPage]
})
export class EditDebtorPageModule {}
