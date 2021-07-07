import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeceasedDetailsPageRoutingModule } from './deceased-details-routing.module';

import { DeceasedDetailsPage } from './deceased-details.page';
import {MatExpansionModule} from '@angular/material/expansion';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScrollingModule,
    DeceasedDetailsPageRoutingModule,
    MatExpansionModule
  ],
  declarations: [DeceasedDetailsPage]
})
export class DeceasedDetailsPageModule {}
