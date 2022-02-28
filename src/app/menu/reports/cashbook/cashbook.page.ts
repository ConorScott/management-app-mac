import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { isWithinInterval } from 'date-fns';
import { Subscription } from 'rxjs';
import { DateRangePage } from 'src/app/shared/date-range/date-range.page';
import { CashBook } from './cashbbok.model';
import { CashbookService } from './cashbook.service';
import { EditCashbookPage } from './edit-cashbook/edit-cashbook.page';
import { NewCashbookPage } from './new-cashbook/new-cashbook.page';
import { ViewCashbookPage } from './view-cashbook/view-cashbook.page';

@Component({
  selector: 'app-cashbook',
  templateUrl: './cashbook.page.html',
  styleUrls: ['./cashbook.page.scss'],
})
export class CashbookPage implements OnInit, OnDestroy {

  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  filtered = [];
  searchTerm: string;
  startDate;
  endDate;
  filterSelected = false;
  cashbook: CashBook[];
  filteredCashbook: CashBook[];
  isLoading = false;
  invalidSelection = false;
  mobile = false;

  private cashbookSub: Subscription;

  constructor(
    private cashbookService: CashbookService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    if (window.screen.width <= 768) { // 768px portrait
      this.mobile = true;
    }
    this.cashbookSub = this.cashbookService.cashbook.subscribe((cashbook) => {
      this.cashbook = cashbook;

      this.filteredCashbook = this.cashbook;
      this.filtered = [...this.cashbook];
      console.log(this.filtered);
      this.filterSelected = false;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.cashbookService.fetchCashBook().subscribe(() => {
      this.isLoading = false;

    });
  }

  onEdit(cashbookId: string, event?: any) {
    if(event){
      event.stopPropagation();
    }
    this.modalCtrl.create({
      component: EditCashbookPage,
      cssClass: 'new-donation',
      componentProps:{
        // eslint-disable-next-line quote-props
        // eslint-disable-next-line object-shorthand
        cashbookId: cashbookId
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
  onDeleteEntry(cashbookId: string, event?: any) {
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
                .create({ message: 'Deleting Cash Book Entry...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.cashbookService
                    .deleteCashBook(cashbookId)
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
        component: NewCashbookPage,
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

  onView(cashbookId: string) {
    this.modalCtrl
    .create({
      component: ViewCashbookPage,
      cssClass: 'new-donation',
      componentProps: {
        cashbookId,
      },
    })
    .then((modalEl) => {
      modalEl.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        } else if(modalData.data.editCashBook.action === 'edit') {
          this.onEdit(modalData.data.editCashBook.cashbookId);
        } else if(modalData.data.editCashBook.action === 'delete') {
          this.onDeleteEntry(modalData.data.editCashBook.cashbookId);
        }
      });
      modalEl.present();
    });  }

  clearDateFilter() {
    this.startDate = null;
    this.endDate = null;
    this.filtered = this.cashbook;
    this.filterSelected = false;
  }

  onChange(event){
    this.searchTerm = event.target.value;
    const filteration = event.target.value;
    this.filtered = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filtered = this.filteredCashbook;
    }
  }

  filterSearch(searchTerm) {
    return this.filteredCashbook.filter((item) => (
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
    this.filtered = this.cashbook.filter(item => isWithinInterval(new Date(item.entryDate), {start: startDate, end: endDate}));
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
    if (this.cashbookSub){
      this.cashbookSub.unsubscribe();
    }
  }
}
