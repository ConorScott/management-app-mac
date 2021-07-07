import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CemetryListPageRoutingModule } from './cemetery-list-routing.module';

import { CemetryListPage } from './cemetery-list.page';
import { NewCemetryPage } from './new-cemetery/new-cemetery.page';
import { EditCemetryPage } from './edit-cemetery/edit-cemetery.page';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ScrollingModule,
    CemetryListPageRoutingModule
  ],
  declarations: [CemetryListPage, NewCemetryPage, EditCemetryPage]
})
export class CemetryListPageModule {}
