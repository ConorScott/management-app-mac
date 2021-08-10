import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { isWithinInterval } from 'date-fns';
import { Subscription } from 'rxjs';
import { DateRangePage } from 'src/app/shared/date-range/date-range.page';
import { EditTipPage } from './edit-tip/edit-tip.page';
import { NewTipPage } from './new-tip/new-tip.page';
import { TipStatsPage } from './tip-stats/tip-stats.page';
import { Tips } from './tips.model';
import { TipsService } from './tips.service';
import { ViewTipPage } from './view-tip/view-tip.page';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
})
export class TipsPage implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  filtered = [];
  searchTerm: string;
  startDate;
  endDate;
  filterSelected = false;
  tips: Tips[];
  filteredTips: Tips[];
  isLoading = false;
  invalidSelection = false;
  rayTotal: number;
  kieranTotal: number;
  terryTotal: number;
  brianTotal: number;
  stAnnesTotal: number;
  otherTotal: number;
  overallTotal: number;
  paymentDate = false;

  private tipsSub: Subscription;
  private rayTotalSub: Subscription;
  private kieranTotalSub: Subscription;
  private terryTotalSub: Subscription;
  private brianTotalSub: Subscription;
  private stAnnesTotalSub: Subscription;
  private otherTotalSub: Subscription;

  constructor(
    private tipService: TipsService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.tipsSub = this.tipService.tips.subscribe((tips) => {
      this.tips = tips;

      this.filteredTips = this.tips;
      this.filtered = [...this.tips];
      console.log(this.filtered);
      this.filterSelected = false;
      this.tips.reduce(
        (acc, val) => (this.overallTotal = acc += val.entryAmount), 0
      );
      if (this.overallTotal === undefined) {
        this.overallTotal = 0;
      }
      tips.map(tip => {
        console.log(tip.paymentDate);
        if(tip.paymentDate === null){
          this.paymentDate = false;
        } else {
          this.paymentDate = true;
        }
      });
    });

    this.getRayTotal();
    this.getKieranTotal();
    this.getTerryTotal();
    this.getBrianTotal();
    this.getStAnnesTotal();
    // this.getOtherTotal();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.tipService.fetchTips().subscribe(() => {
      this.isLoading = false;
    });
  }

  getRayTotal() {
    this.rayTotalSub = this.tipService
    .fetchTotalPayments('Ray Murtagh').subscribe((total) => {
      console.log(total);
      total.reduce((acc, val) => (this.rayTotal = acc =+ val.entryAmount), 0);
      if (this.rayTotal === undefined) {
        this.rayTotal = 0;
      }
    });
  }

  getKieranTotal() {
    this.kieranTotalSub = this.tipService
    .fetchTotalPayments('Kieran Maughan').subscribe((total) => {
      total.reduce((acc, val) => (this.kieranTotal = acc =+ val.entryAmount), 0);
      if (this.kieranTotal === undefined) {
        this.kieranTotal = 0;
      }
    });
  }

  getTerryTotal() {
    this.terryTotalSub = this.tipService
    .fetchTotalPayments('Terry Butler').subscribe((total) => {
      total.reduce((acc, val) => (this.terryTotal = acc =+ val.entryAmount), 0);
      if (this.terryTotal === undefined) {
        this.terryTotal = 0;
      }
    });
  }

  getBrianTotal() {
    this.brianTotalSub = this.tipService
    .fetchTotalPayments('Brian Scanlon').subscribe((total) => {
      total.reduce((acc, val) => (this.brianTotal = acc =+ val.entryAmount), 0);
      if (this.brianTotal === undefined) {
        this.brianTotal = 0;
      }
    });
  }

  getStAnnesTotal() {
    this.stAnnesTotalSub = this.tipService
    .fetchTotalPayments('St. Anne’s Church Sligo').subscribe((total) => {
      total.reduce((acc, val) => (this.stAnnesTotal = acc =+ val.entryAmount), 0);
      if (this.stAnnesTotal === undefined) {
        this.stAnnesTotal = 0;
      }
    });
  }

  // getOtherTotal() {
  //   this.otherTotalSub = this.tipService
  //   .fetchTotalPayments('Other').subscribe((total) => {
  //     total.reduce((acc, val) => (this.otherTotal = acc =+ val.amount), 0);
  //     if (this.otherTotal === undefined) {
  //       this.otherTotal = 0;
  //     }
  //   });
  // }

  onEdit(tipId: string, event?: any) {
    if (event) {
      event.stopPropagation();
    }
    this.modalCtrl
      .create({
        component: EditTipPage,
        cssClass: 'new-tip',
        componentProps: {
          // eslint-disable-next-line quote-props
          // eslint-disable-next-line object-shorthand
          tipId: tipId,
        },
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
  onDeleteEntry(cashbookId: string, event?: any) {
    if (event) {
      event.stopPropagation();
    }
    this.actionSheetCtrl
      .create({
        header: 'Delete Tip?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Tip Entry...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.tipService.deleteTip(cashbookId).subscribe(() => {
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
        component: NewTipPage,
        cssClass: 'new-donation',
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

  onView(tipId: string) {
    this.modalCtrl
      .create({
        component: ViewTipPage,
        cssClass: 'new-donation',
        componentProps: {
          tipId,
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          } else if (modalData.data.editTip.action === 'edit') {
            this.onEdit(modalData.data.editTip.tipId);
          } else if (modalData.data.editTip.action === 'delete') {
            this.onDeleteEntry(modalData.data.editTip.tipId);
          }
        });
        modalEl.present();
      });
  }

  clearDateFilter() {
    this.startDate = null;
    this.endDate = null;
    this.filtered = this.tips;
    this.filterSelected = false;
  }

  onChange(event) {
    this.searchTerm = event.target.value;
    const filteration = event.target.value;
    this.filtered = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filtered = this.filteredTips;
    }
  }

  filterSearch(searchTerm) {
    return this.filteredTips.filter(
      (item) =>
        item.payeeName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    );
  }

  loadResults(start, end) {
    console.log(start);
    if (!start || !end) {
      return;
    }
    this.startDate = start;
    this.endDate = end;
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    this.filtered = this.tips.filter((item) =>
      isWithinInterval(new Date(item.entryDate), {
        start: startDate,
        end: endDate,
      })
    );
    this.filterSelected = true;
  }

  onFilterDates() {
    this.modalCtrl
      .create({
        component: DateRangePage,
        cssClass: 'cal-modal',
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          this.loadResults(
            modalData.data.dates.start,
            modalData.data.dates.end
          );
        });
        modalEl.present();
      });
  }

  viewPaymentStats() {
    this.modalCtrl
      .create({
        component: TipStatsPage,
        cssClass: 'new-donation',
        componentProps: {
          rayTotal: this.rayTotal,
          kieranTotal: this.kieranTotal,
          terryTotal: this.terryTotal,
          brianTotal: this.brianTotal,
          stAnnesTotal: this.stAnnesTotal,
          overallTotal: this.overallTotal
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {});
        modalEl.present();
      });
  }

  ngOnDestroy() {
    if (this.tipsSub) {
      this.tipsSub.unsubscribe();
    }
  }
}
