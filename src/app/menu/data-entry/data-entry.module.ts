import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataEntryPageRoutingModule } from './data-entry-routing.module';

import { DataEntryPage } from './data-entry.page';
import { MatTabsModule } from '@angular/material/tabs';
import { DeceasedDetailsPage } from './deceased-details/deceased-details.page';
import { DeceasedDetailsPageModule } from './deceased-details/deceased-details.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataEntryPageRoutingModule,
    MatTabsModule,
    DeceasedDetailsPageModule,
    SharedModule
  ],
  declarations: [DataEntryPage]
})
export class DataEntryPageModule {}
