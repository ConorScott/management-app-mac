import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { CashbookService } from '../cashbook.service';

@Component({
  selector: 'app-new-cashbook',
  templateUrl: './new-cashbook.page.html',
  styleUrls: ['./new-cashbook.page.scss'],
})
export class NewCashbookPage implements OnInit {

  form: FormGroup;
  modal: HTMLIonModalElement;

  constructor(
    private cashbookService: CashbookService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      entryDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      entryAmount: new FormControl(null, {
        validators: [Validators.required]
      }),
      entryDesc: new FormControl(null, {
        validators: [Validators.required]
      }),
      payeeName: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
  }

  onAddEntry(){
    this.loadingCtrl
      .create({
        message: 'Creating Entry',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.cashbookService
          .addCashBook(
            this.form.value.entryDate,
            this.form.value.entryAmount,
            this.form.value.entryDesc,
            this.form.value.payeeName,
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
