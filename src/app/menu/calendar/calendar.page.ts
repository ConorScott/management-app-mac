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
  CalendarDateFormatter,
  DateFormatterParams
} from 'angular-calendar';
import { CalendarService } from './calendar.service';
import { Event } from './event.model';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { CalModalPage } from './cal-modal/cal-modal.page';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { stringify } from '@angular/compiler/src/util';
import { id } from 'date-fns/locale';
import { Deceased } from '../data-entry/deceased-details/deceased.model';
import { DeceasedService } from '../data-entry/deceased-details/deceased.service';
import { DatePipe, formatDate } from '@angular/common';
import { ViewEventPage } from './view-event/view-event.page';
import { EditEventPage } from './edit-event/edit-event.page';
import { CustomDateFormatter } from './custom-date-formatter.provider';

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
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class CalendarPage implements OnInit {

  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return formatDate(date, 'EEE', locale);
  }
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  calendar: Event[];
  funeralTimes: Deceased[];
  view: CalendarView = CalendarView.Month;
  title = 'Calendar';

  // eslint-disable-next-line @typescript-eslint/naming-convention
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    event: CalendarEvent;
  };

  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="fas fa-fw fa-pencil-alt"></i>',
  //     a11yLabel: 'Edit',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.handleEvent('Edited', event);
  //     },
  //   },
  //   {
  //     label: '<i class="fas fa-fw fa-trash-alt"></i>',
  //     a11yLabel: 'Delete',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.calendar = this.calendar.filter((iEvent) => iEvent !== event);
  //       this.handleEvent('Deleted', event);
  //     },
  //   },
  // ];

  refresh: Subject<any> = new Subject();

events: Event;
  activeDayIsOpen = true;
  isLoading = false;
  end: string;
  private eventSub: Subscription;
  private deceasedSub: Subscription;

  constructor(
    private calendarService: CalendarService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private modal: NgbModal,
    private deceasedService: DeceasedService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    // this.calendarService.deleteEventDetails().subscribe();
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

  // eventTimesChanged({
  //   event,
  //   newStart,
  //   newEnd,
  // }: CalendarEventTimesChangedEvent): void {
  //   this.events = this.events.map((iEvent) => {
  //     if (iEvent === event) {
  //       return {
  //         ...event,
  //         start: newStart,
  //         end: newEnd,
  //       };
  //     }
  //     return iEvent;
  //   });
  //   // this.handleEvent('Dropped or resized', event);
  // }

  handleEvent({event}: {event: CalendarEvent}): void {
    this.openEventModal(event.id, event.title, event.start, event.end, event.allDay);
  }

  // addEvent(): void {
  //   this.events = [
  //     ...this.events,
  //     {
  //       title: 'New event',
  //       start: startOfDay(new Date()),
  //       end: endOfDay(new Date()),
  //       color: colors.red,
  //       draggable: true,
  //       resizable: {
  //         beforeStart: true,
  //         afterEnd: true,
  //       },
  //     },
  //   ];
  //   this.events = [
  //     ...this.events,
  //     {
  //       title: 'New event',
  //       start: startOfDay(new Date()),
  //       end: endOfDay(new Date()),
  //       color: colors.red,
  //       draggable: true,
  //       resizable: {
  //         beforeStart: true,
  //         afterEnd: true,
  //       },
  //     },
  //   ];
  //   // this.events = [...this.events];
  //   // this.calendarService.addEvent(this.events).subscribe();
  // }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  openEventModal(eventId, title, start, end, allDay) {
    let newEvents: Event;
    this.modalCtrl
      .create({
        component: ViewEventPage,
        componentProps: {
          eventId,
          title,
          start,
          end,
          allDay,
        },
        cssClass: 'new-donation'
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          } else if(modalData.data.editEvent.action === 'edit') {
            this.onEditEvent(modalData.data.editEvent.eventId);
          } else if(modalData.data.editEvent.action === 'delete') {
            this.onDeleteEvent(modalData.data.editEvent.eventId);
          }
        });
        modalEl.present();
      });
  }

  onEditEvent(eventId: string) {
    this.modalCtrl.create({
      component: EditEventPage,
      cssClass: 'new-donation',
      componentProps:{
        // eslint-disable-next-line quote-props
        // eslint-disable-next-line object-shorthand
        eventId: eventId
      }
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
      });
      modalEl.present();
    });
  }
  onDeleteEvent(eventId: string) {
    this.actionSheetCtrl
      .create({
        header: 'Delete Event?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Event Entry...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.calendarService
                    .deleteEvent(eventId)
                    .subscribe(() => {
                      setTimeout(() => {
                        loadingEl.dismiss();
                      }, 2000);
                    });
                });
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

   openCalModal() {
    let newEvents: Event;
    this.modalCtrl
      .create({
        component: CalModalPage,
        cssClass: 'new-event'
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          console.log(modalData.data.eventData.title,
            modalData.data.eventData.start,
            modalData.data.eventData.end,
            modalData.data.eventData.color,
            modalData.data.eventData.desc);
          if(modalData.data.eventData.action === 'event'){
            this.calendarService.addEvent(
              modalData.data.eventData.title,
              modalData.data.eventData.start,
              modalData.data.eventData.end,
              modalData.data.eventData.color,
              modalData.data.eventData.desc,
              ).subscribe((calendar) => {
              // this.calendar = calendar;
            });
          } else if(modalData.data.eventData.action === 'dayOff'){
            this.calendarService
          .addDayOffEvent(
            modalData.data.eventData.title + ' Day Off',
            modalData.data.eventData.start,
            modalData.data.eventData.end,
            modalData.data.eventData.color,
          )
          .subscribe((calendar) => {
            // this.calendar = calendar;
          });
          } else if(modalData.data.eventData.action === 'dayIn'){
            this.calendarService
          .addDayOffEvent(
            modalData.data.eventData.title + ' Day In Lieu',
            modalData.data.eventData.start,
            modalData.data.eventData.end,
            modalData.data.eventData.color,
          )
          .subscribe((calendar) => {
            // this.calendar = calendar;
          });
          }
        });
        modalEl.present();
      });
  }

  // deleteEvent(eventToDelete: CalendarEvent) {
  //   this.events = this.events.filter((event) => event !== eventToDelete);
  // }

  setView(view: CalendarView) {
    this.view = view;
  }

  dayOffEvent(title: string, start, color: string){
    const date = start.split('T')[0];
    const time = start.split('T')[1];
    const reposeDateTime = date + 'T' + time;
    const endTime = new Date(reposeDateTime);
    endTime.setHours(endTime.getHours() + 24);

  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
