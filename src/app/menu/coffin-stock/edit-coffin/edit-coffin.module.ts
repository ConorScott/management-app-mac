import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCoffinPageRoutingModule } from './edit-coffin-routing.module';

import { EditCoffinPage } from './edit-coffin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCoffinPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class EditCoffinPageModule {}
