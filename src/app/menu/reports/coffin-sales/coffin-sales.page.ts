import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { isWithinInterval } from 'date-fns';
import { Subscription } from 'rxjs';
import { DateRangePage } from 'src/app/shared/date-range/date-range.page';
import { CoffinSalesService } from './coffin-sales.service';
import { CoffinSale } from './coffin.model';
import { ViewCoffinSalePage } from './view-coffin-sale/view-coffin-sale.page';

@Component({
  selector: 'app-coffin-sales',
  templateUrl: './coffin-sales.page.html',
  styleUrls: ['./coffin-sales.page.scss'],
})
export class CoffinSalesPage implements OnInit, OnDestroy {

  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;
  filtered = [];
  searchTerm: string;
  startDate;
  endDate;
  filterSelected = false;
  coffinSale: CoffinSale[];
  filteredCoffinSale: CoffinSale[];
  isLoading = false;
  invalidSelection = false;
  mobile = false;

  private coffinSalesSub: Subscription;

  constructor(
    private coffinSaleService: CoffinSalesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    if (window.screen.width <= 768) { // 768px portrait
      this.mobile = true;
    }
    this.coffinSalesSub = this.coffinSaleService.coffinSale.subscribe((coffinSale) => {
      this.coffinSale = coffinSale;

      this.filteredCoffinSale = this.coffinSale;
      this.filtered = [...this.coffinSale];
      console.log(this.filtered);
      this.filterSelected = false;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.coffinSaleService.fetchAllCoffinSales().subscribe(() => {
      this.isLoading = false;

    });
  }

  onDeleteEntry(coffinSaleId: string, event?: any) {
    if(event){
      event.stopPropagation();
    }
    this.actionSheetCtrl
      .create({
        header: 'Delete Coffin Sale?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Coffin Entry...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.coffinSaleService
                    .deleteCoffinSale(coffinSaleId)
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

  onView(coffinSaleId: string) {
    this.modalCtrl
    .create({
      component: ViewCoffinSalePage,
      cssClass: 'new-donation',
      componentProps: {
        coffinSaleId,
      },
    })
    .then((modalEl) => {
      modalEl.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        } else if(modalData.data.editCoffinSale.action === 'delete') {
          this.onDeleteEntry(modalData.data.editCoffinSale.coffinSaleId);
        }
      });
      modalEl.present();
    });  }

  clearDateFilter() {
    this.startDate = null;
    this.endDate = null;
    this.filtered = this.coffinSale;
    this.filterSelected = false;
  }

  onChange(event){
    this.searchTerm = event.target.value;
    const filteration = event.target.value;
    this.filtered = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filtered = this.filteredCoffinSale;
    }
  }

  filterSearch(searchTerm) {
    return this.filteredCoffinSale.filter((item) => (
        item.coffinName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
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
    this.filtered = this.coffinSale.filter(item => isWithinInterval(new Date(item.coffinSaleDate), {start: startDate, end: endDate}));
    this.filterSelected = true;
  }

  onFilterDates(){
    this.modalCtrl.create({
      component: DateRangePage,
      cssClass: 'new-donation',
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
    this.coffinSalesSub.unsubscribe();
  }
}
