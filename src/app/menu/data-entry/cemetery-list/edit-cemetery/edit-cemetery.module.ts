import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCemetryPageRoutingModule } from './edit-cemetery-routing.module';

import { EditCemetryPage } from './edit-cemetery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCemetryPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class EditCemetryPageModule {}
