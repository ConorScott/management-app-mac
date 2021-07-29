import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-balance-range',
  templateUrl: './balance-range.page.html',
  styleUrls: ['./balance-range.page.scss'],
})
export class BalanceRangePage implements OnInit {
  startValue: Date;
  endValue: Date;
  modal: HTMLIonModalElement;
  form: FormGroup;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.form = new FormGroup({
      startValue: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      endValue: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
  }

  onSubmitDate(){
    console.log(this.form.value.startValue);
    console.log(this.startValue);
    this.modal.dismiss(
      {
        amount: {
          start: this.startValue,
          end: this.endValue
        }
      },
      'confirm'
    );
  }

  onCancel() {

    this.modal.dismiss(null, 'cancel');


  }

}
