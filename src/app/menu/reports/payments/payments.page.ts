import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { isWithinInterval } from 'date-fns';
import { Subscription } from 'rxjs';
import { DateRangePage } from 'src/app/shared/date-range/date-range.page';
import { EditPaymentModalPage } from 'src/app/shared/edit-payment-modal/edit-payment-modal.page';
import { Payment } from 'src/app/shared/payment.model';
import { ViewPaymentModalPage } from 'src/app/shared/view-payment-modal/view-payment-modal.page';
import { DebtorService } from '../../debtors/debtor.service';
import { ReceiptLayoutPage } from '../receipts/receipt-layout/receipt-layout.page';
import { ReceiptService } from '../receipts/receipt.service';
import { PaymentStatsPage } from './payment-stats/payment-stats.page';
import { PaymentService } from './payment.service';
import { ViewPaymentPage } from './view-payment/view-payment.page';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit, OnDestroy {
  // @ViewChild(CdkVirtualScrollViewport)
  // viewport: CdkVirtualScrollViewport;
  @ViewChild(ReceiptLayoutPage) child: ReceiptLayoutPage;
  filtered = [];
  searchTerm: string;
  startDate;
  endDate;
  filterSelected = false;
  payments: Payment[];
  payment: Payment;
  filteredPayments: Payment[];
  isLoading = false;
  invalidSelection = false;
  receipt: Payment;
  cashTotal: number;
  cardTotal: number;
  eftTotal: number;
  chequeTotal: number;
  draftTotal: number;
  overallTotal: number;
  mobile = false;
  desktop = true;
  debtorPage = false;

  private paymentSub: Subscription;
  private cashTotalSub: Subscription;
  private cardTotalSub: Subscription;
  private eftTotalSub: Subscription;
  private chequeTotalSub: Subscription;
  private draftTotalSub: Subscription;

  constructor(
    private paymentService: PaymentService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private receiptService: ReceiptService,
    private debtorService: DebtorService
  ) {}

  ngOnInit() {
    if (window.screen.width <= 768) { // 768px portrait
      this.mobile = true;
    }
    this.paymentSub = this.paymentService.payments.subscribe((payment) => {
      this.payments = payment;
      this.filteredPayments = this.payments;
      this.filtered = [...this.payments];
      console.log(this.filtered);
      console.log(this.filtered);
      this.payments.reduce(
        (acc, val) => (this.overallTotal = acc += val.amount),
        0
      );
      if (this.overallTotal === undefined) {
        this.overallTotal = 0;
      }
    });
    this.getCashTotal('cash');
    this.getCardTotal('card');
    this.getEftTotal('eft');
    this.getChequeTotal('cheque');
    this.getDraftTotal('draft');
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.paymentService.fetchAllPayments().subscribe(() => {
      this.isLoading = false;
    });
  }

  getCashTotal(method: string) {
    this.cashTotalSub = this.paymentService
      .fetchCashPayments(method)
      .subscribe((payment) => {
        payment.reduce((acc, val) => (this.cashTotal = acc += val.amount), 0);
        if (this.cashTotal === undefined) {
          this.cashTotal = 0;
        }
      });
  }
  getCardTotal(method: string) {
    this.cardTotalSub = this.paymentService
      .fetchCashPayments(method)
      .subscribe((payment) => {
        payment.reduce((acc, val) => (this.cardTotal = acc += val.amount), 0);
        if (this.cardTotal === undefined) {
          this.cardTotal = 0;
        }
      });
  }
  getEftTotal(method: string) {
    this.eftTotalSub = this.paymentService
      .fetchCashPayments(method)
      .subscribe((payment) => {
        payment.reduce((acc, val) => (this.eftTotal = acc += val.amount), 0);
        if (this.eftTotal === undefined) {
          this.eftTotal = 0;
        }
      });
  }
  getChequeTotal(method: string) {
    this.chequeTotalSub = this.paymentService
      .fetchCashPayments(method)
      .subscribe((payment) => {
        payment.reduce((acc, val) => (this.chequeTotal = acc += val.amount), 0);
        if (this.chequeTotal === undefined) {
          this.chequeTotal = 0;
        }
      });
  }
  getDraftTotal(method: string) {
    this.draftTotalSub = this.paymentService
      .fetchCashPayments(method)
      .subscribe((payment) => {
        payment.reduce((acc, val) => (this.draftTotal = acc += val.amount), 0);
        if (this.draftTotal === undefined) {
          this.draftTotal = 0;
        }
      });
  }

  onChange(event) {
    this.searchTerm = event.target.value;
    const filteration = event.target.value;
    this.filtered = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filtered = this.filteredPayments;
    }
  }

  filterSearch(searchTerm) {
    return this.filteredPayments.filter(
      (item) =>
        item.payeeName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    );
  }

  loadResults(start, end) {
    if (!start || !end) {
      return;
    }
    this.startDate = start;
    this.endDate = end;
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    this.filtered = this.filteredPayments.filter((item) =>
      isWithinInterval(new Date(item.paymentDate), {
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

  clearDateFilter() {
    this.startDate = null;
    this.endDate = null;
    this.filtered = this.payments;
    this.filterSelected = false;
  }

  // onAddNew() {

  //   this.modalCtrl
  //     .create({
  //       component: EditPaymentModalPage,
  //     })
  //     .then((modalEl) => {
  //       modalEl.onDidDismiss().then((modalData) => {
  //         if (!modalData.data) {
  //           return;
  //         }
  //         this.paymentService
  //           .add(
  //             paymentId,
  //             modalData.data.editPayment.paymentDate,
  //             modalData.data.editPayment.amount,
  //             modalData.data.editPayment.paymentMethod,
  //             modalData.data.editPayment.payeeName,
  //           )
  //           .subscribe((payment) => {
  //             this.payments = [payment];
  //           });
  //       });
  //       modalEl.present();
  //     });
  // }

  onEdit(paymentId: string, event?: any) {
    if (event != null) {

      event.stopPropagation();
    }
    this.modalCtrl
      .create({
        component: EditPaymentModalPage,
        cssClass: 'new-donation',
        componentProps: {
          // eslint-disable-next-line quote-props
          // eslint-disable-next-line object-shorthand
          paymentId: paymentId,
          debtorPage: this.debtorPage
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

  onView(paymentId: string, debtorId: string) {
    this.modalCtrl
      .create({
        component: ViewPaymentPage,
        cssClass: 'new-donation',
        componentProps: {
          // eslint-disable-next-line quote-props
          // eslint-disable-next-line object-shorthand
          paymentId,
          debtorId,
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          } else if (modalData.data.editPayment.action === 'edit') {
            this.onEdit(modalData.data.editPayment.paymentId);
          } else if (modalData.data.editPayment.action === 'delete') {
            this.onDeleteEntry(
              modalData.data.editPayment.paymentId,
              modalData.data.editPayment.debtorId,
              modalData.data.editPayment.paymentAmount
            );
          }
        });
        modalEl.present();
      });
  }

  viewPaymentStats() {
    this.modalCtrl
      .create({
        component: PaymentStatsPage,
        cssClass: 'new-donation',
        componentProps: {
          cashTotal: this.cashTotal,
          cardTotal: this.cardTotal,
          eftTotal: this.eftTotal,
          chequeTotal: this.chequeTotal,
          draftTotal: this.draftTotal,
          overallTotal: this.overallTotal,
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {});
        modalEl.present();
      });
  }

  // printDiv(receipt){
  //   if(document.getElementById('print_div').innerHTML != null){
  //     console.log('not null');
  //     const div = document.getElementById('print_div').innerHTML;
  //     console.log(div);
  //     this.child.printDiv(div, receipt);
  //   } else {
  //     console.log('null');
  //   }

  // }

  onDeleteEntry(
    paymentId: string,
    debtorId: string,
    amount: number,
    event?: any
  ) {
    if (event != null) {
      event.stopPropagation();
    }
    this.actionSheetCtrl
      .create({
        header: 'Delete Payment?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({
                  message: 'Deleting Payment Entry...',
                  duration: 5000,
                })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.paymentService
                    .deletePayments(paymentId)
                    .subscribe(() => {});
                  // this.debtorService
                  //   .updateDeletedPayment(debtorId, amount)
                  //   .subscribe(() => {
                  //     loadingEl.dismiss();
                  //   });
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

  ngOnDestroy(){
    if(this.paymentSub){
      this.paymentSub.unsubscribe();

    }
  this.cashTotalSub.unsubscribe();
  this.cardTotalSub.unsubscribe();
  this.eftTotalSub.unsubscribe();
  this.chequeTotalSub.unsubscribe();
  this.draftTotalSub.unsubscribe();
  }
}
