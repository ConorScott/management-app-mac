import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CashbookPageRoutingModule } from './cashbook-routing.module';

import { CashbookPage } from './cashbook.page';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { EditCashbookPage } from './edit-cashbook/edit-cashbook.page';
import { NewCashbookPage } from './new-cashbook/new-cashbook.page';
import { ViewCashbookPage } from './view-cashbook/view-cashbook.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CashbookPageRoutingModule,
    ScrollingModule,
    ReactiveFormsModule
  ],
  declarations: [CashbookPage, EditCashbookPage, NewCashbookPage, ViewCashbookPage]
})
export class CashbookPageModule {}
