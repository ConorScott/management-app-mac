import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Donation } from '../donation.model';
import { DonationService } from '../donation.service';

@Component({
  selector: 'app-view-donation',
  templateUrl: './view-donation.page.html',
  styleUrls: ['./view-donation.page.scss'],
})
export class ViewDonationPage implements OnInit {
  @Input() donationId;
  isLoading = false;
  donation: Donation;
  modal: HTMLIonModalElement;

  private donationSub: Subscription;

  constructor(
    private donationService: DonationService,
    private navCtrl: NavController
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
      this.isLoading = false;
    });
  }

  onEditDonation(){
    this.modal.dismiss(
      {
        editDonation: {
          donationId: this.donationId,
          action: 'edit'
        }
      },
      'confirm'
    );

  }

  onDeleteDonation(){
    this.modal.dismiss(
      {
        editDonation: {
          donationId: this.donationId,
          action: 'delete'
        }
      },
      'confirm'
    );
  }

  onCancel(){
    this.modal.dismiss(null, 'cancel');
  }

}
