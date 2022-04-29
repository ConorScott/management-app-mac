import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import { CalendarMode } from 'ionic2-calendar/calendar';
import { CalendarService } from '../calendar.service';
import { Subscription } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { startOfDay } from '@fullcalendar/angular';
import { endOfDay } from 'date-fns';

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
  lightBlue: {
    primary: '#3bdeff',
    secondary: '#3bdeff',
  },
  lightRed: {
    primary:'#f29c96',
    secondary: '#f29c96',
  },
  purple: {
    primary:'#d73ae8',
    secondary: '#ad32ba',
  }
};

@Component({
  selector: 'app-cal-modal',
  templateUrl: './cal-modal.page.html',
  styleUrls: ['./cal-modal.page.scss'],
})
export class CalModalPage implements OnInit {
  startDate;
  endDate;
  modal: HTMLIonModalElement;

  form: FormGroup;

  //Manages subscribe/unsubscribe
  private eventSubscription: Subscription = new Subscription();

  constructor(private activatedRoute: ActivatedRoute,
    private eventService: CalendarService,
    private toastController: ToastController,
    private navCtrl: NavController,
    public alertController: AlertController) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      start: new FormControl(null, {
        updateOn: 'blur',
      }),
      startTime: new FormControl(null, {
        updateOn: 'blur',
      }),
      end: new FormControl(null, {
        updateOn: 'blur',
      }),
      endTime: new FormControl(null, {
        updateOn: 'blur',
      }),
      allDay: new FormControl(null, {
        updateOn: 'blur',
      }),
      desc: new FormControl(null, {
        updateOn: 'blur',
      }),
      dayIn: new FormControl(null, {
        updateOn: 'blur',
      }),
    });
  }

  addEventDayOff(action: string){
    let selectedColour: string;
    if(action === 'dayOff'){
      selectedColour = colors.lightBlue;
    } else if(action === 'dayIn'){
      selectedColour = colors.purple;
    }
    const startDate = this.form.value.start.split('T')[0];
    const endDate = this.form.value.end.split('T')[0];
    const myTime = 'T00:00:00.001+01:00';
    const myEndTime = 'T00:59:00.001+01:00';
    const startTime = startDate + myTime;
    const endTime = endDate + myEndTime;
    const finalEndtime = new Date(endTime);
    finalEndtime.setHours(finalEndtime.getHours() - 1);
    // new Date (finalEndtime).toISOString();
    console.log(finalEndtime);
    // const reposeDateTime = date + 'T' + time;
    // const endTime = new Date(reposeDateTime);
    this.modal.dismiss(
      {
        eventData: {
          title: this.form.value.title,
          start: startTime,
          end: finalEndtime,
          color: selectedColour,
          allDay: this.form.value.allDay,
          action
        }
      },
      'confirm'
    );
    this.form.reset();

  }

  addEvent(){
    const startDate = this.form.value.start.split('T')[0];
    const startTime = this.form.value.startTime.split('T')[1];
    const endDate = this.form.value.end.split('T')[0];
    const endTime = this.form.value.endTime.split('T')[1];
    const eventStart = startDate + 'T' + startTime;
    const eventEnd = endDate + 'T' + endTime;
    this.modal.dismiss(
      {
        eventData: {
          title: this.form.value.title,
          start: eventStart,
          end: eventEnd,
          color: colors.lightRed,
          desc: this.form.value.desc,
          allDay: this.form.value.allDay,
          action: 'event'
        }
      },
      'confirm'
    );
    this.form.reset();

  }

  onCancel(){
    this.modal.dismiss(null, 'cancel');
  }
}
