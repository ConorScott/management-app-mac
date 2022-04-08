import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DebtorService } from 'src/app/menu/debtors/debtor.service';
import { PaymentService } from 'src/app/menu/reports/payments/payment.service';
import { Payment } from '../payment.model';

@Component({
  selector: 'app-edit-payment-modal',
  templateUrl: './edit-payment-modal.page.html',
  styleUrls: ['./edit-payment-modal.page.scss'],
})
export class EditPaymentModalPage implements OnInit {
  @Input() paymentId: string;
  @Input() debtorPage: boolean;
  payment: Payment;
  isLoading = false;
  form: FormGroup;

  modal: HTMLIonModalElement;
  private paymentSub: Subscription;

  constructor(
    private debtorService: DebtorService,
    private paymentService: PaymentService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.paymentId) {
      this.navCtrl.navigateBack('/menu/tabs/debtors');
      return;
    }
    this.isLoading = true;
    this.paymentSub = this.paymentService.getPayments(this.paymentId).subscribe((payment) => {
      this.payment = payment;
      console.log(this.paymentId);
      console.log(this.payment);
       console.log(this.payment.amount);
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

  onEditPayment(){
    console.log(this.form.value.amount);
    // this.modal.dismiss(
    //   {
    //     editPayment: {
    //       paymentId: this.paymentId,
    //       action: 'edit'
    //     }
    //   },
    //   'confirm'
    // );
    this.loadingCtrl
    .create({
      message: 'Updating Payment',
    })
    .then((loadingEl) => {
      loadingEl.present();
      // this.debtorService.updateDebtors(this.payment.paymentId, this.payment.amount)
      // .subscribe();
      this.paymentService
        .updatePayment(
          this.paymentId,
          this.form.value.paymentDate,
          this.form.value.amount,
          this.form.value.paymentMethod,
          this.form.value.payeeName,
        )
        .subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.paymentSub.unsubscribe();
          this.modal.dismiss();
        });
    });
}

onEditPayments(){
  console.log(this.form.value.amount);
  // this.modal.dismiss(
  //   {
  //     editPayment: {
  //       paymentId: this.paymentId,
  //       action: 'edit'
  //     }
  //   },
  //   'confirm'
  // );
  this.loadingCtrl
  .create({
    message: 'Updating Payment',
  })
  .then((loadingEl) => {
    loadingEl.present();
    // this.debtorService.updateDebtors(this.payment.paymentId, this.payment.amount)
    // .subscribe();
    this.paymentService
      .updatePayments(
        this.paymentId,
        this.form.value.paymentDate,
        this.form.value.amount,
        this.form.value.paymentMethod,
        this.form.value.payeeName,
      )
      .subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.paymentSub.unsubscribe();
        this.modal.dismiss();
      });
  });
}

onCancel() {

  this.modal.dismiss(null, 'cancel');


}

}
