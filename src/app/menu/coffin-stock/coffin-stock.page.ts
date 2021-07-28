import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { Coffin } from './coffin.model';
import { CoffinService } from './coffin.service';
import { EditCoffinPage } from './edit-coffin/edit-coffin.page';

@Component({
  selector: 'app-coffin-stock',
  templateUrl: './coffin-stock.page.html',
  styleUrls: ['./coffin-stock.page.scss'],
})
export class CoffinStockPage implements OnInit, OnDestroy {
  title = 'Coffin Inventory';
  listType = 'sligo';
  filtered = [];
  searchTerm: string;
  filteredCoffins: Coffin[];
  isVisible: boolean;
  coffin: Coffin[];
  isLoading = false;
  private coffinSub: Subscription;

  constructor(
    private coffinService: CoffinService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private sharedService: SharedService,
    private modalCtrl: ModalController,
    private changeDetection: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.coffinSub = this.coffinService.coffin.subscribe((coffin) => {
      this.coffin = coffin;
      this.filtered = this.coffin;
    });
    this.sharedService.cast.subscribe((data) => (this.isVisible = data));
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.coffinService.fetchCoffins(this.listType).subscribe(() => {
      this.isLoading = false;
      this.filteredCoffins = this.coffin;
      this.filtered = [...this.coffin];
    });
  }

  onEdit(coffinId: string) {
    this.modalCtrl.create({
      component: EditCoffinPage,
      componentProps:{
        // eslint-disable-next-line quote-props
        // eslint-disable-next-line object-shorthand
        coffinId: coffinId
      }
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        this.coffinService.updateCoffin(
          coffinId,
          modalData.data.editCoffin.coffinName,
          modalData.data.editCoffin.stockLevel,
          modalData.data.editCoffin.stockLocation
        ).subscribe(coffin => {
          this.coffin = [coffin];
        });
      });
      modalEl.present();
    });
  }
  onDeleteEntry(coffinId: string) {
    this.actionSheetCtrl
      .create({
        header: 'Delete Coffin?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Coffin Entry...'})
                .then((loadingEl) => {
                  loadingEl.present();
                  this.coffinService.deleteCoffin(coffinId).subscribe(() => {
                    // loadingEl.dismiss();
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

  isToggle() {
    this.sharedService.changeToggle();
    console.log('TWO: ' + this.isVisible);
    // this.menuCtrl.toggle('menu');
    // console.log('hello');
  }
  onChange(event) {
    this.searchTerm = event.target.value;
    const filteration = event.target.value;
    this.filtered = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filtered = this.filteredCoffins;
    }
  }

  filterSearch(searchTerm) {
    return this.filteredCoffins.filter(
      (item) =>
        item.coffinName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
    );
  }

  listTypeChange(event){
    console.log(event.target.value);
    this.listType = event.target.value;
    this.coffinService.fetchCoffins(event.target.value).subscribe((deceased) => {
      this.isLoading = false;
      console.log(deceased);
      // this.filteredDeceased = this.deceased;
      // this.filtered = [...this.deceased];
    });
  }

  ngOnDestroy() {
    if (this.coffinSub) {
      this.coffinSub.unsubscribe();
    }
  }
}
