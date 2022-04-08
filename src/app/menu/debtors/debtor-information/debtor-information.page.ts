/* eslint-disable arrow-body-style */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Debtor } from '../debtor.model';
import { DebtorService } from '../debtor.service';
import { PaymentModalComponent } from 'src/app/shared/payment-modal/payment-modal.component';
import { Payment } from 'src/app/shared/payment.model';
import { PaymentService } from '../../reports/payments/payment.service';
import { ReceiptService } from '../../reports/receipts/receipt.service';
import { Receipt } from '../../reports/receipts/receipt.model';
import { ViewPaymentPage } from '../../reports/payments/view-payment/view-payment.page';
import { EditPaymentModalPage } from '../../../shared/edit-payment-modal/edit-payment-modal.page';
import { ViewReceiptPage } from '../../reports/receipts/view-receipt/view-receipt.page';
import { EditReceiptPage } from '../../reports/receipts/edit-receipt/edit-receipt.page';
import { switchMap } from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-debtor-information',
  templateUrl: './debtor-information.page.html',
  styleUrls: ['./debtor-information.page.scss'],
})
export class DebtorInformationPage implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;
  filtered = [];
  filteredR = [];
  debtor: Debtor;
  debtorId: string;
  payments: Payment[];
  receipt: Receipt;
  receipts: Receipt[];
  filteredReceipts: Receipt[];
  filteredPayments: Payment[];
  newBalance: number;
  invoiceTotal: number = 0;
  paymentTotal: number = 0;
  total: number = 0;
  isLoading = false;
  segment = 'information';
  title = 'Debtor Information';
  isMobile = false;
  debtorPage = true;
  private debtorSub: Subscription;
  private paymentSub: Subscription;
  private receiptSub: Subscription;

  constructor(
    private debtorService: DebtorService,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private paymentService: PaymentService,
    private receiptService: ReceiptService,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    if(window.screen.width < 576)
    {
      this.isMobile = true;
    }
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('debtorId')) {
        this.navCtrl.navigateBack('/menu/tabs/debtors');
        return;
      }
      this.debtorId = paramMap.get('debtorId');
      this.isLoading = true;
      this.debtorSub = this.debtorService
        .getDebtor(paramMap.get('debtorId'))
        .subscribe((debtor) => {
          this.debtor = debtor;
          this.isLoading = false;
        });
        this.paymentService.payment.subscribe(payments => {
          this.payments = payments;
                this.filteredPayments = this.payments;
                this.filtered = [...this.payments];
                console.log(this.filteredPayments)
        });
        this.receiptService.receipts.subscribe(receipts => {
          this.receipts = receipts;
          this.filteredReceipts = this.receipts;
          this.filteredR = [...this.receipts];
        });
          });

  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.paymentSub = this.paymentService.fetchPayments(this.debtorId).subscribe(payment => {
      this.isLoading = false;
      console.log(payment);

      this.getInvoiceTotal(payment);

      console.log('Payment Total' + this.paymentTotal)


      // console.log(payment.reduce((acc, val) => this.newTotal = acc += val.amount, 0));
      // this.debtor.totalBalance = this.debtor.totalBalance - this.newTotal;
    });
    this.receiptService.fetchReceipts(this.debtorId).subscribe(receipt => {
      this.isLoading = false;
  });
  }

  getInvoiceTotal(payment){
    this.debtor.totalBalance = 0;
    this.invoiceTotal = 0;
    this.paymentTotal =0;
    payment.forEach(res => {
      console.log(res.amount);
      this.paymentTotal += res.amount;

      console.log(this.invoiceTotal + 'invoicetotal')
    });
    if(this.debtor.casketCoverPrice === undefined){
      this.debtor.casketCoverPrice = 0;
    } if(this.debtor.churchOfferringPrice === undefined){
      this.debtor.churchOfferringPrice = 0;
    } if(this.debtor.clothsPrice === undefined){
      this.debtor.clothsPrice = 0;
    }if(this.debtor.coffinPrice === undefined){
      this.debtor.coffinPrice = 0;
    } if(this.debtor.coronerDoctorCertPrice === undefined){
      this.debtor.coronerDoctorCertPrice = 0;
    } if(this.debtor.cremationPrice === undefined){
      this.debtor.cremationPrice = 0;
    }if(this.debtor.flowersPrice === undefined){
      this.debtor.flowersPrice = 0;
    } if(this.debtor.graveMarkerPrice === undefined){
      this.debtor.graveMarkerPrice = 0;
    } if(this.debtor.graveMatsTimbersPrice === undefined){
      this.debtor.graveMatsTimbersPrice = 0;
    }if(this.debtor.graveOpenPrice === undefined){
      this.debtor.graveOpenPrice = 0;
    } if(this.debtor.gravePurchasePrice === undefined){
      this.debtor.gravePurchasePrice = 0;
    } if(this.debtor.hairdresserPrice === undefined){
      this.debtor.hairdresserPrice = 0;
    }
    if(this.debtor.organistPrice === undefined){
      this.debtor.organistPrice = 0;
    } if(this.debtor.otherDetailsPrice === undefined){
      this.debtor.otherDetailsPrice = 0;
    }if(this.debtor.paperNoticePrice === undefined){
      this.debtor.paperNoticePrice = 0;
    } if(this.debtor.radioNoticePrice === undefined){
      this.debtor.radioNoticePrice = 0;
    } if(this.debtor.sacristianPrice === undefined){
      this.debtor.sacristianPrice = 0;
    }if(this.debtor.servicesPrice === undefined){
      this.debtor.servicesPrice = 0;
    } if(this.debtor.soloistPrice === undefined){
      this.debtor.soloistPrice = 0;
    } if(this.debtor.urnPrice === undefined){
      this.debtor.urnPrice = 0;
    }
    console.log(this.debtor);
          console.log('Console hyup');

    this.invoiceTotal =
    this.debtor.casketCoverPrice +
    this.debtor.churchOfferringPrice +
    this.debtor.clothsPrice +
    this.debtor.coffinPrice +
    this.debtor.coronerDoctorCertPrice +
    this.debtor.cremationPrice +
    this.debtor.flowersPrice +
    this.debtor.graveMarkerPrice +
    this.debtor.graveMatsTimbersPrice +
    this.debtor.graveOpenPrice +
    this.debtor.gravePurchasePrice +
    this.debtor.hairdresserPrice +
    this.debtor.organistPrice +
    this.debtor.otherDetailsPrice +
    this.debtor.paperNoticePrice +
    this.debtor.radioNoticePrice +
    this.debtor.sacristianPrice +
    this.debtor.servicesPrice +
    this.debtor.soloistPrice +
    this.debtor.urnPrice;

    this.total = this.invoiceTotal - this.paymentTotal;
    console.log('Invoice Total' + this.invoiceTotal);
  }

  presentModal(){
    this.modalCtrl.create({
      component: PaymentModalComponent,
      cssClass: 'new-donation',
      componentProps:{
        // eslint-disable-next-line quote-props
        'totalBalance': this.debtor.totalBalance
      }
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        this.paymentService.addPayments(modalData.data.paymentData, this.debtorId, this.debtor.deceasedName)
        .subscribe((payments) => {
          // this.payments = payments;
        });
        // this.ionViewWillEnter();
        // this.newBalance = this.debtor.totalBalance - modalData.data.paymentData.amount;
        // this.debtorService.updateDebtor(
        //   this.debtorId,
        //   modalData.data.paymentData
        // ).subscribe(debtor => {
        //   this.debtor = debtor;
        //   // this.paymentService.fetchPayments(this.debtor.id).subscribe();
        // });
      });
      modalEl.present();
      // this.router.navigate([`/menu/tabs/debtors/view/${this.debtorId}`]);
    });

  }

  onEditPayment(paymentId: string, event?: any) {
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

  onViewPayment(paymentId: string, debtorId: string) {
    this.modalCtrl
      .create({
        component: ViewPaymentPage,
        cssClass: 'new-donation',
        componentProps: {
          // eslint-disable-next-line quote-props
          // eslint-disable-next-line object-shorthand
          paymentId,
          debtorId
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          } else if (modalData.data.editPayment.action === 'add'){
            this.receipt = modalData.data.receiptData.paymentInfo;
            this.receiptService.addReceipt(this.receipt, debtorId).subscribe();
          } else if (modalData.data.editPayment.action === 'delete'){
            this.deletePayment(
              modalData.data.editPayment.paymentId,
              modalData.data.editPayment.debtorId,
              modalData.data.editPayment.paymentAmount
            );
          }
        });
        modalEl.present();
      });
  }

  deletePayment(paymentId: string, debtorId: string, amount: number, event?: any){
    if (event != null) {
      event.stopPropagation();
    }
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
              this.paymentService.deletePayment(paymentId).subscribe(() => {

              });
              // this.ionViewWillEnter();
              // this.debtorService.updateDeletedPayment(debtorId, amount).subscribe((debtor) => {
              //   this.debtor = debtor;
              //   loadingEl.dismiss();
              // });
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

  onViewReceipt(receiptId: string) {
    this.modalCtrl
      .create({
        component: ViewReceiptPage,
        cssClass: 'new-donation',
        componentProps: {
          // eslint-disable-next-line quote-props
          // eslint-disable-next-line object-shorthand
          receiptId
        },
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          } else if (modalData.data.editReceipt.action === 'edit') {
            this.onEditReceipt(modalData.data.editReceipt.receiptId);
          } else if (modalData.data.editReceipt.action === 'delete') {
            this.onDeleteReceipt(
              modalData.data.editReceipt.receiptId,
            );
          }
        });
        modalEl.present();
      });
  }

  onEditReceipt(receiptId: string, event?: any) {
    if (event != null) {
      event.stopPropagation();
    }
    this.modalCtrl
      .create({
        component: EditReceiptPage,
        cssClass: 'new-donation',
        componentProps: {
          // eslint-disable-next-line quote-props
          // eslint-disable-next-line object-shorthand
          receiptId: receiptId,
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

  onDeleteReceipt(receiptId: string, event?: any) {
    if (event != null) {
      event.stopPropagation();
    }
    this.actionSheetCtrl
      .create({
        header: 'Delete Receipt?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Receipt Entry...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.receiptService
                    .deleteReceipts(receiptId)
                    .subscribe((receipt) => {
                      this.receipts = receipt;
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

  onChange(event) {
    const filteration = event.target.value;
    this.filtered = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filtered = this.filteredPayments;
    }
  }

  filterSearch(searchTerm) {
    return this.payments.filter((item) => {
      return (
        item.payeeName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      );
    });
  }

  onChangeR(event) {
    const filteration = event.target.value;
    this.filteredR = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filteredR = this.filteredReceipts;
    }
  }

  filterSearchR(searchTerm) {
    return this.payments.filter((item) => {
      return (
        item.payeeName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      );
    });
  }

  ngOnDestroy() {
    this.debtorSub.unsubscribe();
    this.paymentSub.unsubscribe();
  }

}
