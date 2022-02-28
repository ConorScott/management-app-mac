import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { isWithinInterval } from 'date-fns';
import { Subscription } from 'rxjs';
import { DateRangePage } from 'src/app/shared/date-range/date-range.page';
import { Donation } from './donation.model';
import { DonationService } from './donation.service';
import { EditDonationPage } from './edit-donation/edit-donation.page';
import { NewDonationPage } from './new-donation/new-donation.page';
import { ViewDonationPage } from './view-donation/view-donation.page';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.page.html',
  styleUrls: ['./donations.page.scss'],
})
export class DonationsPage implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  filtered = [];
  searchTerm: string;
  startDate;
  endDate;
  filterSelected = false;
  donation: Donation[];
  filteredDonation: Donation[];
  isLoading = false;
  invalidSelection = false;
  mobile = false;

  private donationSub: Subscription;

  constructor(
    private donationService: DonationService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    if (window.screen.width <= 768) { // 768px portrait
      this.mobile = true;
    }
    this.donationSub = this.donationService.donation.subscribe((donation) => {
      this.donation = donation;

      this.filteredDonation = this.donation;
      this.filtered = [...this.donation];
      console.log(this.filtered);
      this.filterSelected = false;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.donationService.fetchDonations().subscribe(() => {
      this.isLoading = false;

    });
  }

  onEdit(donationId: string, event?: any) {
    if(event){
      event.stopPropagation();
    }
    this.modalCtrl.create({
      component: EditDonationPage,
      cssClass: 'new-donation',
      componentProps:{
        // eslint-disable-next-line quote-props
        // eslint-disable-next-line object-shorthand
        donationId: donationId
      }
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
      });
      modalEl.present();
    });
  }
  onDeleteEntry(donationId: string, event?: any) {
    if(event){
      event.stopPropagation();
    }
    this.actionSheetCtrl
      .create({
        header: 'Delete Donation?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Donation Entry...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.donationService
                    .deleteDonation(donationId)
                    .subscribe(() => {
                      setTimeout(() => {
                        loadingEl.dismiss();
                      }, 2000);
                    });
                });
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  onAddNew() {
    this.modalCtrl
      .create({
        component: NewDonationPage,
        cssClass: 'new-donation'
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
        });
        modalEl.present();
      });
  }

  onView(donationId: string) {
    this.modalCtrl
    .create({
      component: ViewDonationPage,
      cssClass: 'new-donation',
      componentProps: {
        donationId,
      },
    })
    .then((modalEl) => {
      modalEl.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        } else if(modalData.data.editDonation.action === 'edit') {
          this.onEdit(modalData.data.editDonation.donationId);
        } else if(modalData.data.editDonation.action === 'delete') {
          this.onDeleteEntry(modalData.data.editDonation.donationId);
        }
      });
      modalEl.present();
    });  }

  clearDateFilter() {
    this.startDate = null;
    this.endDate = null;
    this.filtered = this.donation;
    this.filterSelected = false;
  }

  onChange(event){
    this.searchTerm = event.target.value;
    const filteration = event.target.value;
    this.filtered = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filtered = this.filteredDonation;
    }
  }

  filterSearch(searchTerm) {
    return this.filteredDonation.filter((item) => (
        item.payeeName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      ));
  }

  loadResults(start, end){
    console.log(start);
    if(!start || !end){
      return;
    }
    this.startDate = start;
    this.endDate = end;
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    this.filtered = this.donation.filter(item => isWithinInterval(new Date(item.donationDate), {start: startDate, end: endDate}));
    this.filterSelected = true;
  }

  onFilterDates(){
    this.modalCtrl.create({
      component: DateRangePage,
      cssClass: 'cal-modal',
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        this.loadResults(modalData.data.dates.start, modalData.data.dates.end);
      });
      modalEl.present();
    });
  }


  ngOnDestroy(){
    if (this.donationSub){
      this.donationSub.unsubscribe();
    }
  }

}
