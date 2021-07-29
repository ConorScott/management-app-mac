import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDebtorPageRoutingModule } from './edit-debtor-routing.module';

import { EditDebtorPage } from './edit-debtor.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditDebtorPageRoutingModule,
    SharedModule
  ],
  declarations: [EditDebtorPage]
})
export class EditDebtorPageModule {}
