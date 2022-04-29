import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NoticeLayoutPageRoutingModule } from './notice-layout-routing.module';

import { NoticeLayoutPage } from './notice-layout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NoticeLayoutPageRoutingModule
  ],
  declarations: []
})
export class NoticeLayoutPageModule {}
