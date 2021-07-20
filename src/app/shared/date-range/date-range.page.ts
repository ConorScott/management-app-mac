import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.page.html',
  styleUrls: ['./date-range.page.scss'],
})
export class DateRangePage implements OnInit {
  startDate: Date;
  endDate: Date;
  modal: HTMLIonModalElement;
  form: FormGroup;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.form = new FormGroup({
      startDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      endDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
  }

  onSubmitDate(){
    console.log(this.form.value.startDate);
    console.log(this.startDate);
    this.modal.dismiss(
      {
        dates: {
          start: this.startDate,
          end: this.endDate
        }
      },
      'confirm'
    );
  }

  onCancel() {

    this.modal.dismiss(null, 'cancel');


  }

}
