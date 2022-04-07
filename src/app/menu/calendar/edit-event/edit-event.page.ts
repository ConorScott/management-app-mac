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


  event: Event;
  isLoading = false;

  form: FormGroup;
  modal: HTMLIonModalElement;
  private eventSub: Subscription;

  constructor(
    private calendarService: CalendarService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    console.log(this.eventId);
    if (!this.eventId) {
      this.navCtrl.navigateBack('/menu/tabs/reports/donations');
      return;
    }
    this.isLoading = true;
    this.eventSub = this.calendarService
    .getEventEdit(this.eventId)
    .subscribe((event) => {
      console.log(event);
      this.event = event;
      this.form = new FormGroup({
        title: new FormControl(this.event.title, {
          validators: [Validators.required]
        }),
        start: new FormControl(this.event.start, {
          validators: [Validators.required]
        }),
        end: new FormControl(this.event.end, {
          validators: [Validators.required]
        })
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
            this.form.value.end
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
