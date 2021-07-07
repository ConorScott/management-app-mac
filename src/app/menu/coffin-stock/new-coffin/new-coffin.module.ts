import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewCoffinPageRoutingModule } from './new-coffin-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewCoffinPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class NewCoffinPageModule {}
