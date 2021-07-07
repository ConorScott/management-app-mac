import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoffinStockPageRoutingModule } from './coffin-stock-routing.module';

import { CoffinStockPage } from './coffin-stock.page';
import { NewCoffinPage } from './new-coffin/new-coffin.page';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { EditCoffinPage } from './edit-coffin/edit-coffin.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ScrollingModule,
    CoffinStockPageRoutingModule,
    SharedModule
  ],
  declarations: [CoffinStockPage, NewCoffinPage, EditCoffinPage]
})
export class CoffinStockPageModule {}
