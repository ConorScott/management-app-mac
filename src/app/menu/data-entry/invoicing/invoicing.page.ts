import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  IonItemSliding,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { isWithinInterval } from 'date-fns';
import { Subscription } from 'rxjs';
import { DateRangePage } from 'src/app/shared/date-range/date-range.page';
import { Invoice } from './invoice.model';
import { InvoiceService } from './invoice.service';

@Component({
  selector: 'app-invoicing',
  templateUrl: './invoicing.page.html',
  styleUrls: ['./invoicing.page.scss'],
})
export class InvoicingPage implements OnInit, OnDestroy {
  searchTerm: string;
  filtered = [];
  startDate;
  endDate;
  invoice: Invoice[];
  filteredInvoice: Invoice[];
  isLoading = false;
  filterSelected = false;
  private invoiceSub: Subscription;

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.invoiceSub = this.invoiceService.invoice.subscribe((invoice) => {
      this.invoice = invoice;
      this.filteredInvoice = this.invoice;
      this.filtered = [...this.invoice];
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.invoiceService.fetchInvoices().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(invoiceId: string, event: any) {
    event.stopPropagation();
    this.router.navigate([
      '/',
      'menu',
      'tabs',
      'data-entry',
      'invoicing',
      'edit',
      invoiceId,
    ]);
    console.log('Editing item', invoiceId);
  }

  onView(invoiceId: string) {
    this.router.navigate([
      '/',
      'menu',
      'tabs',
      'data-entry',
      'invoicing',
      'view',
      invoiceId,
    ]);
  }

  onChange(event) {
    this.searchTerm = event.target.value;
    const filteration = event.target.value;
    this.filtered = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filtered = this.filteredInvoice;
    }
  }

  filterSearch(searchTerm) {
    return this.filteredInvoice.filter((item) => (
        item.deceasedName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
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
    this.filtered = this.filteredInvoice.filter((item) => isWithinInterval(new Date(item.invoiceDate), {
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

  onDeleteEntry(invoiceId: string, event: any) {
    event.stopPropagation();
    this.actionSheetCtrl
      .create({
        header: 'Delete Invoice?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Invoice...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.invoiceService.cancelBooking(invoiceId).subscribe(() => {
                    loadingEl.dismiss();
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

  clearDateFilter(){
    this.startDate = null;
    this.endDate = null;
    this.filtered = this.invoice;
    this.filterSelected = false;
  }


  ngOnDestroy() {
    if (this.invoiceSub) {
      this.invoiceSub.unsubscribe();
    }
  }
}
