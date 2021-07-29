import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { isBefore, isWithinInterval } from 'date-fns';
import { Subscription } from 'rxjs';
import { DateRangePage } from 'src/app/shared/date-range/date-range.page';
import { SharedService } from 'src/app/shared/shared.service';
import { Debtor } from './debtor.model';
import { DebtorService } from './debtor.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { BalanceRangePage } from 'src/app/shared/balance-range/balance-range.page';


@Component({
  selector: 'app-debtors',
  templateUrl: './debtors.page.html',
  styleUrls: ['./debtors.page.scss'],
})
export class DebtorsPage implements OnInit, OnDestroy {
  title = 'Debtors';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;
  filtered = [];
  searchTerm: string;
  isVisible: boolean;
  totalBalance: number;
  startDate;
  endDate;
  startValue;
  endValue;
  filterSelected = false;
  filterAmountSelected = false;
  debtor: Debtor[];
  filteredDebtor: Debtor[];
  isLoading = false;
  invalidSelection = false;
  newTotal: number;
  private debtorSub: Subscription;

  constructor(
    private debtorService: DebtorService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private sharedService: SharedService,
  ) {}

  ngOnInit() {
    this.debtorSub = this.debtorService.debtor.subscribe((debtor) => {
      this.debtor = debtor;
      this.filtered = this.debtor;
      this.filteredDebtor = this.debtor;
      this.filtered = [...this.debtor];
      this.filterSelected = false;
      console.log(this.filtered);
      // debtor.map(total => {
      // })
    });
    this.sharedService.cast.subscribe(data => this.isVisible = data);
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.debtorService.fetchDebtors().subscribe((total) => {
      this.isLoading = false;

    });
  }

  onEdit(debtorId: string, event: any) {
    event.stopPropagation();
    this.router.navigate([
      '/',
      'menu',
      'tabs',
      'debtors',
      'edit',
      debtorId,
    ]);
    console.log('Editing item', debtorId);
  }

  onView(debtorId: string) {
    this.router.navigate(['/', 'menu', 'tabs', 'debtors', 'view', debtorId]);
  }

  onDeleteEntry(debtorId: string, event: any) {
    event.stopPropagation();
    this.actionSheetCtrl
      .create({
        header: 'Delete Entry?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Entry...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.debtorService.cancelBooking(debtorId).subscribe(() => {
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

  onChange(event) {
    this.searchTerm = event.target.value;
    const filteration = event.target.value;
    this.filtered = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filtered = this.filteredDebtor;
    }
  }

  filterSearch(searchTerm) {
    console.log(searchTerm);
    console.log(this.filteredDebtor);
    return this.filteredDebtor.filter((item) => (
        item.deceasedName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      ));
  }
  loadBalanceResults(start, end) {
    console.log(start);
    if (!start || !end) {
      return;
    }
    this.startValue = start;
    this.endValue = end;

    this.filtered = this.filteredDebtor.filter((item) => isWithinInterval(new Date(item.totalBalance), {
        start: this.startValue,
        end: this.endValue,
      }));
    this.filterAmountSelected = true;
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
    this.filtered = this.filteredDebtor.filter((item) => isWithinInterval(new Date(item.invoiceDate), {
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

  onFilterBalance() {
    this.modalCtrl
      .create({
        component: BalanceRangePage,
        cssClass: 'cal-modal',
      })
      .then((modalEl) => {
        modalEl.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          console.log(modalData.data);
          this.loadBalanceResults(
            modalData.data.amount.start,
            modalData.data.amount.end
          );
        });
        modalEl.present();
      });
  }

  clearDateFilter() {
    this.startDate = null;
    this.endDate = null;
    this.filtered = this.debtor;
    this.filterSelected = false;
  }

  clearAmountFilter() {
    this.startValue = null;
    this.endValue = null;
    this.filtered = this.debtor;
    this.filterAmountSelected = false;
  }


  isToggle(){
    this.sharedService.changeToggle();
    console.log('TWO: ' + this.isVisible);
    // this.menuCtrl.toggle('menu');
    // console.log('hello');
  }

  ngOnDestroy() {
    if (this.debtorSub) {
      this.debtorSub.unsubscribe();
    }
  }
}
