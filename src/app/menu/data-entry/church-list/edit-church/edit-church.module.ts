import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditChurchPageRoutingModule } from './edit-church-routing.module';

import { EditChurchPage } from './edit-church.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditChurchPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: []
})
export class EditChurchPageModule {}
