import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditDetailsPageRoutingModule } from './edit-details-routing.module';

import { EditDetailsPage } from './edit-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditDetailsPageRoutingModule
  ],
  declarations: [EditDetailsPage]
})
export class EditDetailsPageModule {}
