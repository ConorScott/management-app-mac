import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})
export class PaymentModalComponent implements OnInit {
  @Input() totalBalance: number;
  form: FormGroup;

  modal: HTMLIonModalElement;

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {

    this.form = new FormGroup({
      paymentDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      amount: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      paymentMethod: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      payeeName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
  }

  onCreatePayment(){

      this.modal.dismiss(
        {
          paymentData: {
            paymentDate: this.form.value.paymentDate,
            amount: this.form.value.amount,
            paymentMethod: this.form.value.paymentMethod,
            payeeName: this.form.value.payeeName
          }
        },
        'confirm'
      );
      this.form.reset();
  }

  onCancel() {

    this.modal.dismiss(null, 'cancel');


  }

}
