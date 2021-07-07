import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewCemetryPageRoutingModule } from './new-cemetery-routing.module';

import { NewCemetryPage } from './new-cemetery.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewCemetryPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class NewCemetryPageModule {}
