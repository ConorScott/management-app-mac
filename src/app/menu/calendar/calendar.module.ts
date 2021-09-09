import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarPageRoutingModule } from './calendar-routing.module';

import { CalendarPage } from './calendar.page';
import { NgCalendarModule } from 'ionic2-calendar';
import { CalModalPage } from './cal-modal/cal-modal.page';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarDateFormatter, CalendarModule, CalendarNativeDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewEventPage } from './view-event/view-event.page';
import { EditEventPage } from './edit-event/edit-event.page';

class CustomDateFormatter extends CalendarNativeDateFormatter {

  public monthViewColumnHeader({date, locale}: DateFormatterParams): string {
    return new Intl.DateTimeFormat(locale, {weekday: 'short'}).format(date);
  }

}

@NgModule({
  declarations: [CalendarPage, CalModalPage, ViewEventPage, EditEventPage],
  exports:[CalendarPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CalendarPageRoutingModule,
    SharedModule,
    CalendarModule,
    NgbModalModule
  ],
  providers: [
    DatePipe,
    {provide: CalendarDateFormatter, useClass: CustomDateFormatter}]
})
export class CalendarPageModule {}
