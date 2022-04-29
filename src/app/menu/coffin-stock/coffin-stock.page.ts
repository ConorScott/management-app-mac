import { keyframes } from '@angular/animations';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { createConnection } from 'net';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';
import { Coffin } from './coffin.model';
import { CoffinService } from './coffin.service';
import { EditCoffinPage } from './edit-coffin/edit-coffin.page';
import { NewCoffinPage } from './new-coffin/new-coffin.page';

@Component({
  selector: 'app-coffin-stock',
  templateUrl: './coffin-stock.page.html',
  styleUrls: ['./coffin-stock.page.scss'],
})
export class CoffinStockPage implements OnInit, OnDestroy {
  title = 'Coffin Inventory';
  listType = 'sligo';
  filtered = [];
  key = [];
  ballina = [];
  sligoStock = [];
  searchTerm: string;
  filteredCoffins: Coffin[];
  isVisible: boolean;
  filteredBallina = [];
  coffin: Coffin[];
  coffinBallina: Coffin[];
  sligo: boolean;
  isLoading = false;
  modalHeader: any = {
    header: 'Stock Location',
  };
  mobile = false;
  desktop = true;
  // coffinStockSligo: Coffin[];
  private coffinSub: Subscription;
  private coffinSubBallina: Subscription;


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
    let updateCoffin: Coffin[];
    console.log('ng')
    this.sligo = true;
    if (window.screen.width <= 768) { // 768px portrait
      this.mobile = true;
    }
    this.coffinSub = this.coffinService.coffin.subscribe((coffin) => {
      this.coffin = coffin;
      this.filtered = [...coffin];
    });

    this.sharedService.cast.subscribe((data) => (this.isVisible = data));
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.coffinService.fetchCoffins('sligo').subscribe(() => {
      this.isLoading = false;
      // this.filteredCoffins = this.coffin;
      // this.filtered = [...this.coffin];
    });

  }

  onEdit(coffinId: string) {
    this.modalCtrl.create({
      component: EditCoffinPage,
      cssClass:'new-donation',
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
          modalData.data.editCoffin.stockLocation,
          modalData.data.editCoffin.oldstocklocation
        ).subscribe(coffin => {
          console.log(modalData.data.editCoffin.stockLocation);
            if (modalData.data.editCoffin.stockLocation === 'ballina' && modalData.data.editCoffin.stockLocation !== modalData.data.editCoffin.oldstocklocation){
              console.log('(coffin.stockLocation === ballina');

              this.coffinService.fetchCoffins('sligo').subscribe(() => {
                this.isLoading = false;
                // this.filteredCoffins = this.coffin;
                // this.filtered = [...this.coffin];
              });
            } else if (modalData.data.editCoffin.stockLocation === 'sligo' && modalData.data.editCoffin.stockLocation !== modalData.data.editCoffin.oldstocklocation){
              console.log('(coffin.stockLocation === sligo');
              console.log(coffin.stockLocation);

              this.coffinService.fetchCoffins('ballina').subscribe(() => {
                this.isLoading = false;
                // this.filteredCoffins = this.coffin;
                // this.filtered = [...this.coffin];
              });
            }
          // console.log(coffin);
          // // this.filtered.push(coffin);
          // let index = this.filtered.findIndex(x => x.id === coffin.id);
          // console.log('index');
          // console.log(this.filtered[index]);
          // this.filtered[index] = coffin;
        });


      });
      modalEl.present();
    });
  }

  // refreshSubject(){
  //   this.coffinSub = this.coffinService.coffin.subscribe((coffin) => {
  //     this.coffin = coffin;


  //      coffin.filter((e,i) => {
  //        if (e.stockLocation === 'sligo'){
  //         this.filtered.push(e);
  //        }
  //      });
  //      coffin.filter((e,i) => {
  //       if (e.stockLocation === 'ballina'){
  //        this.filteredBallina.push(e);
  //       }
  //     });

  //   });
  // }

  onAddNew(){
    this.modalCtrl.create({
      component: NewCoffinPage,
      cssClass:'new-donation'
    }).then((modalEl) => {
      modalEl.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        }
      });
      modalEl.present();
    });
  }
  onDeleteEntry(coffinId: string, stockLocation: string) {
    if(stockLocation === 'sligo'){
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
    } else {
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
                  this.coffinService.deleteCoffinBallina(coffinId).subscribe(() => {
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
    // console.log(event.target.value);
    // this.listType = event.target.value;
    // if(this.listType === 'sligo'){
    //   this.sligo = true;
    //   console.log(this.filtered)
    // }else {
    //   this.sligo = false;
    //   console.log(this.filteredBallina)

    // }
    this.coffinService.fetchCoffins(event.target.value).subscribe(() => {
      this.isLoading = false;
      // this.filteredCoffins = this.coffin;
      // this.filtered = [...this.coffin];
    });

    // this.coffinService.fetchCoffins(event.target.value).subscribe((deceased) => {
    //   this.isLoading = false;
    //   console.log(deceased);
    //   // this.filteredDeceased = this.deceased;
    //   // this.filtered = [...this.deceased];
    // });
  }

  ngOnDestroy() {
    if (this.coffinSub) {
      this.coffinSub.unsubscribe();
    }
  }
}
