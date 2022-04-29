import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Cemetery } from './cemetery.model';
import { CemeteryService } from './cemetery.service';
import { EditCemetryPage } from './edit-cemetery/edit-cemetery.page';
import { NewCemetryPage } from './new-cemetery/new-cemetery.page';

@Component({
  selector: 'app-cemetry-list',
  templateUrl: './cemetery-list.page.html',
  styleUrls: ['./cemetery-list.page.scss'],
})
export class CemetryListPage implements OnInit, OnDestroy {
  cemetery: Cemetery[];
  searchTerm: string;
  filtered = [];
  filteredCemetery: Cemetery[];
  isLoading = false;
  private cemeterySub: Subscription;

  constructor(
    private cemeteryService: CemeteryService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.cemeterySub = this.cemeteryService.cemetery.subscribe((cemetery) => {
      this.cemetery = cemetery;
      this.filteredCemetery = this.cemetery;
      this.filtered = [...this.cemetery];
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.cemeteryService.fetchCemeterys().subscribe(() => {
      this.isLoading = false;

    });
  }

  onEdit(cemeteryId: string) {
    this.modalCtrl.create({
      component: EditCemetryPage,
cssClass:'new-donation',
      componentProps:{
        // eslint-disable-next-line quote-props
        // eslint-disable-next-line object-shorthand
        cemeteryId: cemeteryId
      }
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        console.log(modalData.data.editCemetery.cemeteryName);
        this.cemeteryService.updateCemetery(
          cemeteryId,
          modalData.data.editCemetery.cemeteryName,
        ).subscribe(cemetery => {
          // this.cemetery = [cemetery];
        });
      });
      modalEl.present();
    });
  }

  onAddNew() {
    this.modalCtrl
      .create({
        component: NewCemetryPage,
        cssClass: 'new-donation'
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
                  this.cemeteryService
                    .deleteCemetery(invoiceId)
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

  onView(cemeteryId: string) {
    this.router.navigate(['/', 'menu', 'tabs', 'debtors', 'view', cemeteryId]);
  }

  onChange(event){
    this.searchTerm = event.target.value;
    const filteration = event.target.value;
    this.filtered = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.filtered = this.filteredCemetery;
    }
  }

  filterSearch(searchTerm) {
    return this.filteredCemetery.filter((item) => (
        item.cemeteryName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      ));
  }

  ngOnDestroy(){
    if (this.cemeterySub){
      this.cemeterySub.unsubscribe();
    }
  }
}
