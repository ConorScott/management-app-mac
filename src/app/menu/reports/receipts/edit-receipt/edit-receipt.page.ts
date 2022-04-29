import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Receipt } from '../receipt.model';
import { ReceiptService } from '../receipt.service';

@Component({
  selector: 'app-edit-receipt',
  templateUrl: './edit-receipt.page.html',
  styleUrls: ['./edit-receipt.page.scss'],
})
export class EditReceiptPage implements OnInit {
  @Input() receiptId: string;
  receipt: Receipt;
  isLoading = false;

  form: FormGroup;
  modal: HTMLIonModalElement;

  private receiptSub: Subscription;

  constructor(
    private receiptService: ReceiptService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.receiptId) {
      this.navCtrl.navigateBack('/menu/tabs/reports/receipt');
      return;
    }
    this.isLoading = true;
    this.receiptSub = this.receiptService
    .getDonations(this.receiptId)
    .subscribe((receipt) => {
      this.receipt = receipt;
      this.form = new FormGroup({
        paymentDate: new FormControl(this.receipt.paymentDate, {
          validators: [Validators.required]
        }),
        receiptDate: new FormControl(this.receipt.receiptDate, {
          validators: [Validators.required]
        }),
        amount: new FormControl(this.receipt.amount, {
          validators: [Validators.required]
        }),
        paymentMethod: new FormControl(this.receipt.paymentMethod, {
          validators: [Validators.required]
        }),
        payeeName: new FormControl(this.receipt.payeeName, {
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
            'Receipt information could not be fetched. Please try again later.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/menu/tabs/reports/receipt']);
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

  onUpdateReceipt() {
    this.loadingCtrl
      .create({
        message: 'Updating Receipt',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.receiptService
          .updateReceipts(
            this.receiptId,
            this.form.value.paymentDate,
            this.form.value.amount,
            this.form.value.paymentMethod,
            this.form.value.payeeName,
            this.form.value.receiptDate
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.receiptSub.unsubscribe();
            this.modal.dismiss();
          });
      });
  }

  onCancel(){
    this.modal.dismiss(null, 'cancel');
  }

}
