import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DateRangePageRoutingModule } from './date-range-routing.module';

import { DateRangePage } from './date-range.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DateRangePageRoutingModule
  ],
  declarations: [DateRangePage]
})
export class DateRangePageModule {}
