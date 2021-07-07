import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import { IonicModule } from '@ionic/angular';

import { EventCalendarPageRoutingModule } from './event-calendar-routing.module';

import { EventCalendarPage } from './event-calendar.page';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventCalendarPageRoutingModule,
    FullCalendarModule
  ],
  declarations: [EventCalendarPage]
})
export class EventCalendarPageModule {}
