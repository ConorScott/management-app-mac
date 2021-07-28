import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { DonationService } from '../donation.service';

@Component({
  selector: 'app-new-donation',
  templateUrl: './new-donation.page.html',
  styleUrls: ['./new-donation.page.scss'],
})
export class NewDonationPage implements OnInit {

  form: FormGroup;
  modal: HTMLIonModalElement;

  constructor(
    private donationService: DonationService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      donationDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      donationType: new FormControl(null, {
        validators: [Validators.required]
      }),
      donationDesc: new FormControl(null, {
        validators: [Validators.required]
      }),
      payeeName: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
  }

  onAddDonation(){
    this.loadingCtrl
      .create({
        message: 'Creating Entry',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.donationService
          .addDonation(
            this.form.value.donationDate,
            this.form.value.donationType,
            this.form.value.donationDesc,
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
