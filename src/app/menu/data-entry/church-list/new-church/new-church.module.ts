import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewChurchPageRoutingModule } from './new-church-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewChurchPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class NewChurchPageModule {}
