import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.page.html',
  styleUrls: ['./date-range.page.scss'],
})
export class DateRangePage implements OnInit {
  startDate;
  endDate;
  modal: HTMLIonModalElement;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  onSubmitDate(){
    this.modal.dismiss(
      {
        dates: {
          start: this.startDate,
          end: this.endDate
        }
      },
      'confirm'
    )
  }

  onCancel() {

    this.modal.dismiss(null, 'cancel');


  }

}
