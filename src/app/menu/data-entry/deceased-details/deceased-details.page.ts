import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, IonItemSliding, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Deceased } from './deceased.model';
import { DeceasedService } from './deceased.service';
import {isWithinInterval, isBefore} from 'date-fns';
import { DateRangePage } from 'src/app/shared/date-range/date-range.page';

@Component({
  selector: 'app-deceased-details',
  templateUrl: './deceased-details.page.html',
  styleUrls: ['./deceased-details.page.scss'],
})
export class DeceasedDetailsPage implements OnInit, OnDestroy {
  listType = 'standard';
  filtered = [];
  searchTerm: string;
  startDate;
  endDate;
  deceased: Deceased[];
  isLoading = false;
  filterSelected = false;
  filteredDeceased: Deceased[];
  searchbarOpened = false;
  mobile = false;
  modalHeader: any = {
    header: 'Form Type',
  };
  private deceasedSub: Subscription;

  constructor(
    private deceasedService: DeceasedService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController
  ) {

  }

  ngOnInit() {
    if (window.screen.width <= 768) { // 768px portrait
      this.mobile = true;
    }
    this.deceasedSub = this.deceasedService.deceased.subscribe((deceased) => {
      this.deceased = deceased;
      this.filteredDeceased = this.deceased;
      this.filtered = [...this.deceased];
    });

  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.deceasedService.fetchDeceased(this.listType).subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(deceasedId: string, event: any) {
    event.stopPropagation();
    this.router.navigate([
      '/',
      'menu',
      'tabs',
      'data-entry',
      'deceased',
      'edit',
      deceasedId,
    ]);
    console.log('Editing item', deceasedId);

  }
  onDeleteEntry(deceasedId: string, event: any){
    event.stopPropagation();
    this.actionSheetCtrl
    .create({
      header: 'Delete Entry?',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.loadingCtrl.create({ message: 'Deleting Entry...', duration:5000}).then(loadingEl => {
              loadingEl.present();
              this.deceasedService.cancelBooking(deceasedId).subscribe(() => {
                loadingEl.dismiss();
              });
            });
          },
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    })
    .then((actionSheetEl) => {
      actionSheetEl.present();
    });


  }

  onView(deceasedId: string) {
    this.router.navigate([
      '/',
      'menu',
      'tabs',
      'data-entry',
      'deceased',
      'view',
      deceasedId,
    ]);

  }



  onChange(event) {
    this.searchTerm = event.target.value;
    const filteration = event.target.value;
    this.filtered = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filtered = this.filteredDeceased;
    }
  }

  filterSearch(searchTerm) {
    return this.filteredDeceased.filter((item) => (
        item.deceasedName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
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
    this.filtered = this.deceased.filter(item => isWithinInterval(new Date(item.entryDate), {start: startDate, end: endDate}));
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

  clearDateFilter(){
    this.startDate = null;
    this.endDate = null;
    this.filtered = this.deceased;
    this.filterSelected = false;
  }

  listTypeChange(event){
    console.log(event.target.value);
    this.listType = event.target.value;
    this.deceasedService.fetchDeceased(event.target.value).subscribe((deceased) => {
      this.isLoading = false;
      console.log(deceased);
      // this.filteredDeceased = this.deceased;
      // this.filtered = [...this.deceased];
    });
  }

  ngOnDestroy() {
    if (this.deceasedSub) {
      this.deceasedSub.unsubscribe();
    }
  }
}
