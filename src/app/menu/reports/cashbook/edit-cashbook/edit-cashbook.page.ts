import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CashBook } from '../cashbbok.model';
import { CashbookService } from '../cashbook.service';

@Component({
  selector: 'app-edit-cashbook',
  templateUrl: './edit-cashbook.page.html',
  styleUrls: ['./edit-cashbook.page.scss'],
})
export class EditCashbookPage implements OnInit {

  @Input() cashbookId: string;
  cashbook: CashBook;
  isLoading = false;

  form: FormGroup;
  modal: HTMLIonModalElement;
  private cashbookSub: Subscription;

  constructor(
    private cashbookService: CashbookService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    console.log(this.cashbookId);
    if (!this.cashbookId) {
      this.modal.dismiss();
      return;
    }
    this.isLoading = true;
    this.cashbookSub = this.cashbookService
    .getCashBook(this.cashbookId)
    .subscribe((cashbook) => {
      this.cashbook = cashbook;
      this.form = new FormGroup({
        entryDate: new FormControl(this.cashbook.entryDate, {
          validators: [Validators.required]
        }),
        entryAmount: new FormControl(this.cashbook.entryAmount, {
          validators: [Validators.required]
        }),
        entryDesc: new FormControl(this.cashbook.entryDesc, {
          validators: [Validators.required]
        }),
        payeeName: new FormControl(this.cashbook.payeeName, {
          validators: [Validators.required]
        }),
      });
      this.isLoading = false;
    },
    (error) => {
      this.alertCtrl
        .create({
          header: 'An error occurred!',
          message:
            'Cash Book information could not be fetched. Please try again later.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/menu/tabs/reports/donations']);
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

  onUpdateDonation() {
    this.loadingCtrl
      .create({
        message: 'Updating Donation',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.cashbookService
          .updateCashBook(
            this.cashbookId,
            this.form.value.entryDate,
            this.form.value.entryAmount,
            this.form.value.entryDesc,
            this.form.value.payeeName,
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.cashbookSub.unsubscribe();
            this.modal.dismiss();
          });
      });
  }

  onCancel(){
    this.modal.dismiss(null, 'cancel');
  }
}
