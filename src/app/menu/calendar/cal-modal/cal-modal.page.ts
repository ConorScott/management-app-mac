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
      end: new FormControl(null, {
        updateOn: 'blur',
      }),
      allDay: new FormControl(null, {
        updateOn: 'blur',
      }),
    });
  }

  addEvent(){


    console.log(this.form.value.start);
    this.modal.dismiss(
      {
        eventData: {
          title: this.form.value.title,
          start: this.form.value.start,
          end: this.form.value.end,
          color: colors.red,
          allDay: this.form.value.allDay
        }
      },
      'confirm'
    );
    this.form.reset();

  }
}
