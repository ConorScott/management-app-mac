import { Component, OnInit } from '@angular/core';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { isWithinInterval } from 'date-fns';
import { Subscription } from 'rxjs';
import { DateRangePage } from 'src/app/shared/date-range/date-range.page';
import { EditPaymentModalPage } from 'src/app/shared/edit-payment-modal/edit-payment-modal.page';
import { Payment } from 'src/app/shared/payment.model';
import { ViewPaymentModalPage } from 'src/app/shared/view-payment-modal/view-payment-modal.page';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  // @ViewChild(CdkVirtualScrollViewport)
  // viewport: CdkVirtualScrollViewport;
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
  cashTotal: number;
  cardTotal: number;
  eftTotal: number;
  chequeTotal: number;
  draftTotal: number;
  overallTotal: number;

  private paymentSub: Subscription;
  private paymentTotalSub: Subscription;
  private cashTotalSub: Subscription;
  private cardTotalSub: Subscription;
  private eftTotalSub: Subscription;
  private chequeTotalSub: Subscription;
  private draftTotalSub: Subscription;

  constructor(
    private paymentService: PaymentService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.paymentSub = this.paymentService.payment.subscribe((payment) => {
      this.payments = payment;
      this.filteredPayments = this.payments;
      this.filtered = [...this.payments];
      this.payments.reduce((acc, val) => this.overallTotal = acc += val.amount, 0);
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

  getCashTotal(method: string){
    this.cashTotalSub = this.paymentService.fetchCashPayments(method).subscribe((payment) => {
      payment.reduce((acc, val) => this.cashTotal = acc += val.amount, 0);
      });
  }
  getCardTotal(method: string){
    this.cardTotalSub = this.paymentService.fetchCashPayments(method).subscribe((payment) => {
      payment.reduce((acc, val) => this.cardTotal = acc += val.amount, 0);
      });
  }
  getEftTotal(method: string){
    this.eftTotalSub = this.paymentService.fetchCashPayments(method).subscribe((payment) => {
      payment.reduce((acc, val) => this.eftTotal = acc += val.amount, 0);
      });
  }
  getChequeTotal(method: string){
    this.chequeTotalSub = this.paymentService.fetchCashPayments(method).subscribe((payment) => {
      payment.reduce((acc, val) => this.chequeTotal = acc += val.amount, 0);
      });
  }
  getDraftTotal(method: string){
    this.draftTotalSub = this.paymentService.fetchCashPayments(method).subscribe((payment) => {
      payment.reduce((acc, val) => this.draftTotal = acc += val.amount, 0);
      });
  }


  onChange(event) {
    console.log(event.target.value);
    this.searchTerm = event.target.value;
    const filteration = event.target.value;
    this.filtered = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filtered = this.filteredPayments;
    }
  }

  filterSearch(searchTerm) {
    return this.filteredPayments.filter((item) => (
      item.payeeName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    ));
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
          console.log(modalData.data);
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

  onEdit(paymentId: string) {
    this.modalCtrl
      .create({
        component: EditPaymentModalPage,
        componentProps: {
          // eslint-disable-next-line quote-props
          // eslint-disable-next-line object-shorthand
          paymentId: paymentId,
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          this.paymentService
            .updatePayment(
              paymentId,
              modalData.data.editPayment.paymentDate,
              modalData.data.editPayment.amount,
              modalData.data.editPayment.paymentMethod,
              modalData.data.editPayment.payeeName,
            )
            .subscribe((payment) => {
              this.payments = [payment];
            });
        });
        modalEl.present();
      });
  }

  onView(paymentId: string) {
    this.modalCtrl
      .create({
        component: ViewPaymentModalPage,
        componentProps: {
          // eslint-disable-next-line quote-props
          // eslint-disable-next-line object-shorthand
          paymentId: paymentId,
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

  onDeleteEntry(invoiceId: string, event: any) {
    event.stopPropagation();
    this.actionSheetCtrl
      .create({
        header: 'Delete Cemetery?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Cemetery Entry...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.paymentService
                    .deletePayment(invoiceId)
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
}
