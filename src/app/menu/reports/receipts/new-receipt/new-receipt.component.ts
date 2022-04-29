import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ReceiptService } from '../receipt.service';

@Component({
  selector: 'app-new-receipt',
  templateUrl: './new-receipt.component.html',
  styleUrls: ['./new-receipt.component.scss'],
})
export class NewReceiptComponent implements OnInit {

  form: FormGroup;
  modal: HTMLIonModalElement;

  constructor(
    private receiptService: ReceiptService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      paymentDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      receiptDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      amount: new FormControl(null, {
        validators: [Validators.required]
      }),
      paymentMethod: new FormControl(null, {
        validators: [Validators.required]
      }),
      payeeName: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
  }

  onAddReceipt(){
    this.loadingCtrl
      .create({
        message: 'Creating Entry',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.receiptService
          .addReceiptEntry(
            this.form.value.paymentDate,
            this.form.value.amount,
            this.form.value.paymentMethod,
            this.form.value.payeeName,
            this.form.value.receiptDate
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.modal.dismiss();
          });
      });
  }

  onCancel(){
    this.modal.dismiss(null, 'cancel');
  }

}
