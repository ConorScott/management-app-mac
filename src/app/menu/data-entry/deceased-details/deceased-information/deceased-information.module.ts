import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeceasedInformationPageRoutingModule } from './deceased-information-routing.module';

import { DeceasedInformationPage } from './deceased-information.page';

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { NoticeLayoutPage } from '../notice-layout/notice-layout.page';
import { RadioNoticeLayoutComponent } from '../radio-notice-layout/radio-notice-layout.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeceasedInformationPageRoutingModule
  ],
  declarations: [DeceasedInformationPage, NoticeLayoutPage, RadioNoticeLayoutComponent],
  providers: [
    File,
    FileOpener,
    Printer
  ],
})
export class DeceasedInformationPageModule {}
