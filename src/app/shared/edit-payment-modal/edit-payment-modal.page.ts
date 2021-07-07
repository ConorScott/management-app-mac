import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DebtorService } from 'src/app/menu/debtors/debtor.service';
import { Payment } from '../payment.model';

@Component({
  selector: 'app-edit-payment-modal',
  templateUrl: './edit-payment-modal.page.html',
  styleUrls: ['./edit-payment-modal.page.scss'],
})
export class EditPaymentModalPage implements OnInit {
  @Input() debtorId: string;
  payment: Payment;
  isLoading = false;
  form: FormGroup;

  modal: HTMLIonModalElement;
  private paymentSub: Subscription;

  constructor(
    private debtorService: DebtorService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.debtorId) {
      this.navCtrl.navigateBack('/menu/tabs/debtors');
      return;
    }
    this.isLoading = true;
    this.paymentSub = this.debtorService.getPayments(this.debtorId).subscribe((payment) => {
      this.form = new FormGroup({
        paymentDate: new FormControl(this.payment.paymentDate, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        amount: new FormControl(this.payment.amount, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        paymentMethod: new FormControl(this.payment.paymentMethod, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        payeeName: new FormControl(this.payment.payeeName, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
      });
      this.isLoading = false;
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
