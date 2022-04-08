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
import { TipPayments } from './tip-payments.model';
import { TipPaymentsService } from './tip-payments.service';
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
  filteredTP = [];
  searchTerm: string;
  startDate;
  endDate;
  filterSelected = false;
  tips: Tips[];
  tipPayments: TipPayments[];
  filteredTips: Tips[];
  filteredTipsPayments: Tips[];
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
  tipPayment = false;
  searchbarOpened = false;
  mobile = false;
  tipsAlert: any = {
    header: 'Form Type',
    class: 'tips'

  };

  private tipsSub: Subscription;
  private tipPaymentSub: Subscription;
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
    private loadingCtrl: LoadingController,
    private tipPaymentService: TipPaymentsService
  ) {}

  ngOnInit() {
    if (window.screen.width <= 768) { // 768px portrait
      this.mobile = true;
    }
    this.tipsSub = this.tipService.tips.subscribe((tips) => {
      this.tips = tips;


      this.filteredTips = this.tips;
      this.filtered = [...this.tips];
      this.filterSelected = false;
      this.tips.reduce(
        (acc, val) => (this.overallTotal = acc += val.entryAmount), 0
      );
      if (this.overallTotal === undefined) {
        this.overallTotal = 0;
      }
    });

    this.tipPaymentSub = this.tipPaymentService.tipPayment.subscribe((tipPayment) => {
      this.tipPayments = tipPayment;
      this.filteredTipsPayments = this.tipPayments;
      this.filteredTP = [...this.tipPayments];
      console.log(this.tipPayments);
      console.log(this.filteredTP);

    });

    // this.getRayTotal();
    // this.getKieranTotal();
    // this.getTerryTotal();
    // this.getBrianTotal();
    // this.getStAnnesTotal();
    // this.getOtherTotal();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.tipService.fetchTips().subscribe(() => {
      this.isLoading = false;
    });

    this.tipPaymentService.fetchTipPayments().subscribe(() => {
      this.isLoading = false;
    });
  }

  // getRayTotal() {
  //   this.rayTotalSub = this.tipService
  //   .fetchTotalPayments('Ray Murtagh').subscribe((total) => {
  //     total.reduce((acc, val) => (this.rayTotal = acc =+ val.entryAmount), 0);
  //     if (this.rayTotal === undefined) {
  //       this.rayTotal = 0;
  //     }
  //   });
  // }

  // getKieranTotal() {
  //   this.kieranTotalSub = this.tipService
  //   .fetchTotalPayments('Kieran Maughan').subscribe((total) => {
  //     total.reduce((acc, val) => (this.kieranTotal = acc =+ val.entryAmount), 0);
  //     if (this.kieranTotal === undefined) {
  //       this.kieranTotal = 0;
  //     }
  //   });
  // }

  // getTerryTotal() {
  //   this.terryTotalSub = this.tipService
  //   .fetchTotalPayments('Terry Butler').subscribe((total) => {
  //     total.reduce((acc, val) => (this.terryTotal = acc =+ val.entryAmount), 0);
  //     if (this.terryTotal === undefined) {
  //       this.terryTotal = 0;
  //     }
  //   });
  // }

  // getBrianTotal() {
  //   this.brianTotalSub = this.tipService
  //   .fetchTotalPayments('Brian Scanlon').subscribe((total) => {
  //     total.reduce((acc, val) => (this.brianTotal = acc =+ val.entryAmount), 0);
  //     if (this.brianTotal === undefined) {
  //       this.brianTotal = 0;
  //     }
  //   });
  // }

  // getStAnnesTotal() {
  //   this.stAnnesTotalSub = this.tipService
  //   .fetchTotalPayments('St. Anne’s Church Sligo').subscribe((total) => {
  //     total.reduce((acc, val) => (this.stAnnesTotal = acc =+ val.entryAmount), 0);
  //     if (this.stAnnesTotal === undefined) {
  //       this.stAnnesTotal = 0;
  //     }
  //   });
  // }

  // getOtherTotal() {
  //   this.otherTotalSub = this.tipService
  //   .fetchTotalPayments('Other').subscribe((total) => {
  //     total.reduce((acc, val) => (this.otherTotal = acc =+ val.amount), 0);
  //     if (this.otherTotal === undefined) {
  //       this.otherTotal = 0;
  //     }
  //   });
  // }

  onEdit(tipId: string, type?: string, event?: any) {
    console.log(event);
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
          type
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

  onDeleteTipPayment(cashbookId: string, event?: any) {
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
                .create({ message: 'Deleting Tip Payment...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.tipPaymentService.deleteTipPayment(cashbookId).subscribe(() => {
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
        cssClass: 'new-tip',
        componentProps: {
          tipPayment: this.tipPayment,
          filtered: this.filtered
        }
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

  onView(tipId: string, type: string) {
    this.modalCtrl
      .create({
        component: ViewTipPage,
        cssClass: 'new-tip',
        componentProps: {
          tipId,
          type
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          } else if (modalData.data.editTip.action === 'edit' && modalData.data.editTip.type === 'tip') {
            this.onEdit(modalData.data.editTip.tipId, modalData.data.editTip.type);
          } else if (modalData.data.editTip.action === 'edit' && modalData.data.editTip.type === 'tipPayment') {
            this.onEdit(modalData.data.editTip.tipId, modalData.data.editTip.type);
          }
           else if (modalData.data.editTip.action === 'delete' && modalData.data.editTip.type === 'tip') {
            this.onDeleteEntry(modalData.data.editTip.tipId);
          } else if (modalData.data.editTip.action === 'delete' && modalData.data.editTip.type === 'tipPayment') {
            this.onDeleteTipPayment(modalData.data.editTip.tipId);
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

  listTypeChange(event){
    console.log(event.target.value);
    if(event.target.value === 'tips'){
      this.tipPayment = false;
      // this.tipService.fetchTips().subscribe(() => {
      //   this.isLoading = false;
      // });
    } else if(event.target.value === 'tipPayments') {
      this.tipPayment = true;
      console.log(this.tipPayment);
    }
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
          overallTotal: this.overallTotal,
          tips: this.filtered,
          tipPayment: this.tipPayment
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
