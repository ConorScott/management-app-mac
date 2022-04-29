import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { isWithinInterval } from 'date-fns';
import { Subscription } from 'rxjs';
import { DateRangePage } from 'src/app/shared/date-range/date-range.page';
import { EditReceiptPage } from './edit-receipt/edit-receipt.page';
import { NewReceiptComponent } from './new-receipt/new-receipt.component';
import { Receipt } from './receipt.model';
import { ReceiptService } from './receipt.service';
import { ViewReceiptPage } from './view-receipt/view-receipt.page';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.page.html',
  styleUrls: ['./receipts.page.scss'],
})
export class ReceiptsPage implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  filtered = [];
  searchTerm: string;
  startDate;
  endDate;
  filterSelected = false;
  receipt: Receipt[];
  filteredReceipt: Receipt[];
  isLoading = false;
  invalidSelection = false;
  mobile = false;

  private receiptSub: Subscription;

  constructor(
    private receiptService: ReceiptService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController
  ) { }

  ngOnInit() {
    if (window.screen.width <= 768) { // 768px portrait
      this.mobile = true;
    }
    this.receiptSub = this.receiptService.receipt.subscribe((receipt) => {
      this.receipt = receipt;

      this.filteredReceipt = this.receipt;
      this.filtered = [...this.receipt];
      console.log(this.filtered);
      this.filterSelected = false;
    });
    console.log("mobile" + this.mobile);
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.receiptService.fetchAllPayments().subscribe((total) => {
      this.isLoading = false;
      console.log(total);
    });
  }

  onChange(event) {
    this.searchTerm = event.target.value;
    const filteration = event.target.value;
    this.filtered = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filtered = this.filteredReceipt;
    }
  }

  filterSearch(searchTerm) {
    console.log(searchTerm);
    console.log(this.filteredReceipt);
    return this.filteredReceipt.filter((item) => (
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
    this.filtered = this.filteredReceipt.filter((item) => isWithinInterval(new Date(item.paymentDate), {
        start: startDate,
        end: endDate,
      }));
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
    this.filtered = this.receipt;
    this.filterSelected = false;
  }

  onEdit(receiptId: string, event?: any) {
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

  onView(receiptId: string) {
    // console.log(paymentId);
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
            this.onEdit(modalData.data.editReceipt.receiptId);
          } else if (modalData.data.editReceipt.action === 'delete') {
            this.onDeleteEntry(
              modalData.data.editReceipt.receiptId,
            );
          }
        });
        modalEl.present();
      });
  }

  // onAddNew() {
  //   console.log('hello');
  //   this.modalCtrl
  //     .create({
  //       component: NewReceiptComponent,
  //       cssClass: 'new-donation'
  //     })
  //     .then((modalEl) => {
  //       modalEl.onDidDismiss().then((modalData) => {
  //         if (!modalData.data) {
  //           return;
  //         }
  //       });
  //       modalEl.present();
  //     });
  // }

  async onAddNew() {
    console.log('hello');
    const modal = await this.modalCtrl
      .create({
        component: NewReceiptComponent,
        cssClass: 'new-donation'
      });
      return await modal.present();
  }

  onDeleteEntry(receiptId: string, event?: any) {
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
                    .deleteReceipt(receiptId)
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
