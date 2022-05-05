import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CalendarService } from '../calendar.service';
import { Event } from '../event.model';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {

  @Input() eventId: string;
  @Input() allDay: boolean;


  event: Event;
  isLoading = false;

  form: FormGroup;
  modal: HTMLIonModalElement;
  returnDate: Date;
  endDate: Date;
  dateString: string;
  massEvent = false;
  private eventSub: Subscription;

  constructor(
    private calendarService: CalendarService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router,
    public datepipe: DatePipe
  ) { }

  ngOnInit() {
    console.log(this.eventId);
    console.log(this.allDay);

    this.isLoading = true;
    this.eventSub = this.calendarService
    .getEventEdit(this.eventId)
    .subscribe((event) => {
      console.log(event);

      this.event = event;
      if(this.allDay === true){
        console.log('All Day');
        // this.returnDate = new Date(this.event.end).toISOString();
        console.log(this.event.end);
        this.returnDate = new Date(this.event.end);
        console.log(this.returnDate);

        this.returnDate.setHours(this.returnDate.getHours() + 24);
        // new Date(this.returnDate).toISOString();
        this.dateString = new Date(this.returnDate).toISOString();
        console.log('dateString');
        console.log(this.dateString);
        this.returnDate = new Date(this.dateString);
      } else {
        this.dateString = new Date(this.event.end).toISOString();
            }

      this.form = new FormGroup({
        title: new FormControl(this.event.title, {
          validators: [Validators.required]
        }),
        start: new FormControl(this.event.start, {
          validators: [Validators.required]
        }),
        end: new FormControl(this.dateString, {
          validators: [Validators.required]
        }),
        desc: new FormControl(this.event.desc)
      });
      this.isLoading = false;
    },
    (error) => {
      this.alertCtrl
        .create({
          header: 'An error occurred!',
          message:
            'Event information could not be fetched. Please try again later.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/menu/tabs/calendar']);
              },
            },
          ],
        })
        .then((alertEl) => {
          alertEl.present();
        });
    }
    );
  }

  onUpdateEvent() {
    if(this.event.color.primary === '#f29c96'){
      this.endDate = this.form.value.end;
    } else {
      this.endDate = new Date(this.form.value.end);
      this.endDate.setHours(this.endDate.getHours() - 24);
    }


        this.loadingCtrl
      .create({
        message: 'Updating Event',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.calendarService
          .updateEventTimes(
            this.eventId,
            this.form.value.title,
            this.form.value.start,
            this.endDate,
            this.allDay,
            this.form.value.desc
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.eventSub.unsubscribe();
            this.modal.dismiss();
          });
      });
  }

  onUpdateFuneralEvent() {
    const startDate = this.form.value.start.split('T')[0];
    const startTime = this.form.value.start.split('T')[1];
    const endDate = this.form.value.end.split('T')[0];
    const endTime = this.form.value.end.split('T')[1];
    const eventStart = startDate + 'T' + startTime;
    const eventEnd = startDate + 'T' + endTime;


        this.loadingCtrl
      .create({
        message: 'Updating Event',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.calendarService
          .updateEventTimes(
            this.eventId,
            this.form.value.title,
            new Date(eventStart),
            new Date(eventEnd),
            this.allDay
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.eventSub.unsubscribe();
            this.modal.dismiss();
          });
      });
  }

  onCancel(){
    this.modal.dismiss(null, 'cancel');
  }

}
