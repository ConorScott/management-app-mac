import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { CalendarMode } from 'ionic2-calendar/calendar';
import { CalendarService } from '../calendar.service';
import { Subscription } from 'rxjs';
import { Calendar } from '../event.model';
import * as moment from 'moment';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cal-modal',
  templateUrl: './cal-modal.page.html',
  styleUrls: ['./cal-modal.page.scss'],
})
export class CalModalPage implements OnInit {
  @Input() lastDaySelected: string;
  form: FormGroup;
  modal: HTMLIonModalElement;
  event: Calendar = null;
  eventBackup: Calendar = null;
  month: string;
  minDate = '2017-01-01';
  maxDate = '2025-01-01';
  receivedEventId = null;
  receivedStartDate = null;

  isNewEvent = false;

  //Manages subscribe/unsubscribe
  private eventSubscription: Subscription = new Subscription();

  constructor(private activatedRoute: ActivatedRoute,
    private eventService: CalendarService,
    private toastController: ToastController,
    private navCtrl: NavController,
    public alertController: AlertController) {
  }

  ngOnInit() {
    this.receivedStartDate = this.lastDaySelected;
    this.isNewEvent = true;
    this.resetEvent();
    // const id = this.activatedRoute.snapshot.paramMap.get('eventId');
    // this.receivedStartDate = this.activatedRoute.snapshot.paramMap.get('startDate');
    // if (id === 'new') {
    //   //Create a new event object
    //   this.receivedEventId = null;
    //   this.isNewEvent = true;
    //   this.resetEvent();
    // } else {
    //   //Download event from firestore
    //   this.receivedEventId = id;
    //   this.isNewEvent = false;
    //   this.eventSubscription = this.eventService.getEvent(this.receivedEventId).subscribe(res => {
    //     this.event = res;
    //     this.eventBackup = JSON.parse(JSON.stringify(res)); //Clone event to check for modifications before leaving
    //     this.updateMonth();
    //   });
    // }
  }

  resetEvent() {
    if (this.receivedStartDate !== null) {
      this.event = {
        title: '',
        desc: '',
        endTime: new Date(this.receivedStartDate).toISOString(),
        startTime: new Date(this.receivedStartDate).toISOString(),
        allDay: false,
      };
    } else {
      this.event = {
        title: '',
        desc: '',
        endTime: new Date().toISOString(),
        startTime: new Date().toISOString(),
        allDay: false,
      };
    }
    this.updateMonth();
  }

  updateMonth() {
    this.month = moment(this.event.startTime).format('MMMM');
  }

  //Save changes from both new and modified events
  saveEvent() {
    const eventCopy = {
      title: this.event.title,
      startTime: moment(this.event.startTime).format('YYYY-MM-DDTHH:mm'),
      endTime: moment(this.event.endTime).format('YYYY-MM-DDTHH:mm'),
      allDay: this.event.allDay,
      desc: this.event.desc,
    };

    if (eventCopy.allDay) {
      //TODO
      eventCopy.startTime = moment(this.event.startTime).format('YYYY-MM-DDTHH:mm');
      eventCopy.endTime = moment(this.event.startTime).format('YYYY-MM-DDTHH:mm'); //If all day, start and end is the same
    }

    if (this.isNewEvent) {
      //Create a new one
      this.addEvent(eventCopy);
    } else {
      //Update the original eventID with the new one
      // this.updateEvent(eventCopy);
    }
  }

  //Create a new event in firestore
  addEvent(newEvent: any) {
    // this.eventService.addEvent(
    //   newEvent.title,
    //   newEvent.desc,
    //   newEvent.startTime,
    //   newEvent.endTime,
    //   newEvent.allDay
    // ).subscribe();

    this.modal.dismiss(
      {
        newEvent: {
          title: newEvent.title,
          desc: newEvent.desc,
          startTime: newEvent.startTime,
          endTime: newEvent.endTime,
          allDay: newEvent.allDay,
        }
      },
      'confirm'
    );
  }

  //Update an existing event
  // updateEvent(modifiedEvent: any) {
  //   this.eventService.updateEvent(modifiedEvent, this.receivedEventId)
  //     .then((result) => {
  //       this.presentToast('Event successfully updated!');
  //       this.navCtrl.back();
  //     })
  //     .catch((error) => {
  //       this.presentToast('An error ocurred!');
  //       console.error('Error adding document: ', error);
  //     });
  // }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  ionViewWillLeave() {
    this.eventSubscription.unsubscribe();
  }

  // async deleteEvent() {
  //   const toast = await this.toastController.create({
  //     header: 'Are you sure?',
  //     position: 'bottom',
  //     buttons: [
  //       {
  //         side: 'start',
  //         icon: 'trash',
  //         text: 'Delete',
  //         handler: () => {

  //           this.eventService.removeEvent(this.receivedEventId)
  //             .then(() => {
  //               this.presentToast('Event successfully deleted!');
  //               this.navCtrl.back();
  //             })
  //             .catch((error) => {
  //               this.presentToast('An error ocurred!');
  //               console.error('Error deleting document: ', error);
  //             });

  //           this.navCtrl.back();
  //         }
  //       }, {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       }
  //     ]
  //   });
  //   toast.present();
  // }

  async goBack() {

    //Check if users has made changes on event. Not necessary for new events.
    if (!this.isNewEvent && (JSON.stringify(this.event) !== JSON.stringify(this.eventBackup))) {

      const alert = await this.alertController.create({
        header: 'Save changes?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Confirm Cancel');
            }
          },
          {
            text: 'Yes, save',
            handler: () => {
              this.saveEvent();
            }
          },
          {
            text: 'No, don\'t save',
            handler: () => {
              this.navCtrl.back();
            }
          }

        ]
      });

      await alert.present();



    } else {

      this.navCtrl.back();

    }


  }

  //receive events from alarm icons
  // updateAlarm() {
  //   if (this.event.alarm) {
  //     //switch off
  //     this.event.alarm = false;
  //   } else {
  //     //switch on
  //     this.event.alarm = true;
  //   }
  // }
}
