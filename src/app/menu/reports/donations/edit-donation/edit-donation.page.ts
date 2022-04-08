import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Donation } from '../donation.model';
import { DonationService } from '../donation.service';

@Component({
  selector: 'app-edit-donation',
  templateUrl: './edit-donation.page.html',
  styleUrls: ['./edit-donation.page.scss'],
})
export class EditDonationPage implements OnInit {
  @Input() donationId: string;
  donation: Donation;
  isLoading = false;

  form: FormGroup;
  modal: HTMLIonModalElement;
  private donationSub: Subscription;

  constructor(
    private donationService: DonationService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.donationId) {
      this.navCtrl.navigateBack('/menu/tabs/reports/donations');
      return;
    }
    this.isLoading = true;
    this.donationSub = this.donationService
    .getDonations(this.donationId)
    .subscribe((donation) => {
      this.donation = donation;
      this.form = new FormGroup({
        donationDate: new FormControl(this.donation.donationDate, {
          validators: [Validators.required]
        }),
        donationType: new FormControl(this.donation.donationType, {
          validators: [Validators.required]
        }),
        donationDesc: new FormControl(this.donation.donationDesc, {
          validators: [Validators.required]
        }),
        payeeName: new FormControl(this.donation.payeeName, {
          validators: [Validators.required]
        }),
        amount: new FormControl(this.donation.amount, {
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
            'Donation information could not be fetched. Please try again later.',
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
        this.donationService
          .updateDonation(
            this.donationId,
            this.form.value.donationDate,
            this.form.value.donationType,
            this.form.value.donationDesc,
            this.form.value.payeeName,
            this.form.value.amount
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.donationSub.unsubscribe();
            this.modal.dismiss();
          });
      });
  }

  onCancel(){
    this.modal.dismiss(null, 'cancel');
  }
  //   this.modal.dismiss(
  //     {
  //       updateDonation: {
  //         donationDate: this.form.value.donationDate,
  //         donationType: this.form.value.donationType,
  //         donationDesc: this.form.value.donationDesc,
  //         payeeName: this.form.value.payeeName
  //       }
  //     },
  //     'confirm'
  //   );
  //   this.form.reset();
  // }

}
