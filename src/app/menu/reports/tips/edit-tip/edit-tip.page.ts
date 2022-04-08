import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TipPayments } from '../tip-payments.model';
import { TipPaymentsService } from '../tip-payments.service';
import { Tips } from '../tips.model';
import { TipsService } from '../tips.service';

@Component({
  selector: 'app-edit-tip',
  templateUrl: './edit-tip.page.html',
  styleUrls: ['./edit-tip.page.scss'],
})
export class EditTipPage implements OnInit {

  @Input() tipId: string;
  @Input() type: string;
  tips: Tips;
  tipPayments: TipPayments;
  isLoading = false;

  form: FormGroup;
  modal: HTMLIonModalElement;
  private tipsSub: Subscription;

  constructor(
    private tipService: TipsService,
    private tipPaymentService: TipPaymentsService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.tipId) {
      this.modal.dismiss();
      return;
    }
    if(this.type === 'tip'){
      this.isLoading = true;
    this.tipsSub = this.tipService
    .getTips(this.tipId)
    .subscribe((tips) => {
      this.tips = tips;
      this.form = new FormGroup({
        entryDate: new FormControl(this.tips.entryDate, {
          validators: [Validators.required]
        }),
        entryAmount: new FormControl(this.tips.entryAmount, {
          validators: [Validators.required]
        }),
        entryDesc: new FormControl(this.tips.entryDesc, {
          validators: [Validators.required]
        }),
        payeeName: new FormControl(this.tips.payeeName, {
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
            'Tip information could not be fetched. Please try again later.',
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

    } else if(this.type === 'tipPayment'){
      this.isLoading = true;
      this.tipsSub = this.tipPaymentService
      .getTips(this.tipId)
      .subscribe((tips) => {
        this.tipPayments = tips;
        this.form = new FormGroup({
          entryDate: new FormControl(this.tipPayments.entryDate, {
            validators: [Validators.required]
          }),
          entryAmount: new FormControl(this.tipPayments.entryAmount, {
            validators: [Validators.required]
          }),
          entryDesc: new FormControl(this.tipPayments.entryDesc, {
            validators: [Validators.required]
          }),
          payeeName: new FormControl(this.tipPayments.payeeName, {
            validators: [Validators.required]
          }),
          paymentDate: new FormControl(this.tipPayments.paymentDate, {
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
              'Tip information could not be fetched. Please try again later.',
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

  }

  onUpdateDonation() {
    this.loadingCtrl
      .create({
        message: 'Updating Tip',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.tipService
          .updateTips(
            this.tipId,
            this.form.value.entryDate,
            this.form.value.entryAmount,
            this.form.value.entryDesc,
            this.form.value.payeeName,
            this.form.value.paymentDate
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.tipsSub.unsubscribe();
            this.modal.dismiss();
          });
      });
  }

  onUpdateTip() {
    this.loadingCtrl
      .create({
        message: 'Updating Tip Payment',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.tipPaymentService
          .updateTipPayment(
            this.tipId,
            this.form.value.entryDate,
            this.form.value.entryAmount,
            this.form.value.entryDesc,
            this.form.value.payeeName,
            this.form.value.paymentDate
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.tipsSub.unsubscribe();
            this.modal.dismiss();
          });
      });
  }

  onCancel(){
    this.modal.dismiss(null, 'cancel');
  }

}
