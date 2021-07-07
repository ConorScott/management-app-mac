import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeceasedInformationPageRoutingModule } from './deceased-information-routing.module';

import { DeceasedInformationPage } from './deceased-information.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeceasedInformationPageRoutingModule
  ],
  declarations: [DeceasedInformationPage]
})
export class DeceasedInformationPageModule {}
