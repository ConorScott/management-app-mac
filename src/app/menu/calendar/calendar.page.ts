import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { CalendarService } from './calendar.service';
import { title } from 'process';
import { Event } from './event.model';
import { ModalController } from '@ionic/angular';
import { CalModalPage } from './cal-modal/cal-modal.page';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { stringify } from '@angular/compiler/src/util';
import { id } from 'date-fns/locale';
import { Deceased } from '../data-entry/deceased-details/deceased.model';
import { DeceasedService } from '../data-entry/deceased-details/deceased.service';
import { DatePipe } from '@angular/common';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  calendar: Event[];
  funeralTimes: Deceased[];
  view: CalendarView = CalendarView.Month;
  title = 'Calendar';

  // eslint-disable-next-line @typescript-eslint/naming-convention
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  activeDayIsOpen = true;
  isLoading = false;
  end: string;
  private eventSub: Subscription;
  private deceasedSub: Subscription;

  constructor(
    private calendarService: CalendarService,
    private modalCtrl: ModalController,
    private modal: NgbModal,
    private deceasedService: DeceasedService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.eventSub = this.calendarService.calendar.subscribe((calendar) => {
      this.calendar = calendar;

      this.calendar.map((events) => {

        // events.start = startOfDay(new Date(events.start));
        // events.end = endOfDay(new Date(events.end));
        events.start = new Date(events.start);
        events.end = new Date(events.end);
      });
    });

    // this.deceasedSub = this.deceasedService.deceased.subscribe((deceased) => {
    //   this.funeralTimes = deceased;

    //   this.funeralTimes.map((events) => {
    //     // events.start = startOfDay(new Date(events.start));
    //     // events.end = endOfDay(new Date(events.end));
    //     events.reposeTime = new Date(events.reposeTime);
    //     this.end = this.datePipe.transform(new Date(events.reposeDate),'yyyy-MM-dd');
    //     console.log(this.end);
    //     events.removalTime = new Date(events.removalTime);
    //     events.churchArrivalTime = new Date(events.churchArrivalTime);
    //     events.massTime = new Date(events.massTime);
    //   });
    // });
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.calendarService.fetchEvents().subscribe((calendar) => {
      this.isLoading = false;
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    // this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
    // this.events = [...this.events];
    // this.calendarService.addEvent(this.events).subscribe();
  }

  openCalModal() {
    let newEvents: Event;
    this.modalCtrl
      .create({
        component: CalModalPage,
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          // newEvents = new Event(
          //   modalData.data.eventData.title:
          //   modalData.data.eventData.start,
          //   modalData.data.eventData.end,
          // )
          this.calendarService
            .addEvent(
              modalData.data.eventData.title,
              modalData.data.eventData.start,
              modalData.data.eventData.end,
              modalData.data.eventData.color,
              modalData.data.eventData.allDay
            )
            .subscribe(() => {});
        });
        modalEl.present();
      });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
