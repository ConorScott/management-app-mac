import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChurchListPageRoutingModule } from './church-list-routing.module';

import { ChurchListPage } from './church-list.page';
import { NewChurchPage } from './new-church/new-church.page';
import { EditChurchPage } from './edit-church/edit-church.page';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ScrollingModule,
    ChurchListPageRoutingModule
  ],
  declarations: [ChurchListPage, NewChurchPage, EditChurchPage]
})
export class ChurchListPageModule {}
