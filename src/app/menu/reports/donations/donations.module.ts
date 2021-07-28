import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DonationsPageRoutingModule } from './donations-routing.module';

import { DonationsPage } from './donations.page';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ViewDonationPage } from './view-donation/view-donation.page';
import { NewDonationPage } from './new-donation/new-donation.page';
import { EditDonationPage } from './edit-donation/edit-donation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DonationsPageRoutingModule,
    ScrollingModule,
    ReactiveFormsModule
  ],
  declarations: [DonationsPage,  ViewDonationPage, NewDonationPage, EditDonationPage]
})
export class DonationsPageModule {}
