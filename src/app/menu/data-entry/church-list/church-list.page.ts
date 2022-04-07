import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineManagerService } from 'src/app/services/offline-manager.service';
import { StorageService } from 'src/app/services/storage-service.service';
import { Church } from './church.model';
import { ChurchService } from './church.service';
import { EditChurchPage } from './edit-church/edit-church.page';
import { NewChurchPage } from './new-church/new-church.page';

@Component({
  selector: 'app-church-list',
  templateUrl: './church-list.page.html',
  styleUrls: ['./church-list.page.scss'],
})
export class ChurchListPage implements OnInit, OnDestroy {
  church: Church[];
  searchTerm: string;
  filtered =[];
  filteredChurch: Church[];
  isLoading = false;
  private churchSub: Subscription;

  constructor(
    private churchService: ChurchService,
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private networkService: NetworkService,
    private offlineManager: OfflineManagerService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.churchSub = this.churchService.church.subscribe((church) => {
      this.church = church;
      this.filteredChurch = this.church;
      this.filtered = [...this.church];
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.churchService.fetchChurches().subscribe(() => {
      this.isLoading = false;

    });
  }

  // onEdit(churchId: string) {
  //   this.router.navigate([
  //     '/',
  //     'menu',
  //     'tabs',
  //     'data-entry',
  //     'church-list',
  //     'edit',
  //     churchId,
  //   ]);
  //   console.log('Editing item', churchId);
  // }

  onAddNew() {
    this.modalCtrl
      .create({
        component: NewChurchPage,
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

  onDeleteEntry(churchId: string) {
    this.actionSheetCtrl
      .create({
        header: 'Delete Church Entry?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Church Entry...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.churchService.deleteChurch(churchId).subscribe(() => {
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
      this.filtered = this.filteredChurch;
    }
  }

  filterSearch(searchTerm) {
    console.log(searchTerm);
    console.log(this.filteredChurch);
    return this.filteredChurch.filter((item) => (
        item.churchName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      ));
  }
  onEdit(churchId: string){
    this.modalCtrl.create({
      component: EditChurchPage,
      cssClass: 'new-donation',
      componentProps:{
        // eslint-disable-next-line quote-props
        // eslint-disable-next-line object-shorthand
        churchId: churchId
      }
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        console.log(modalData.data.editChurch.churchName);
        this.churchService.updateChurch(
          churchId,
          modalData.data.editChurch.churchName,
        ).subscribe(church => {
          this.church = [church];
        });
      });
      modalEl.present();
    });
  }

  ngOnDestroy() {
    if (this.churchSub) {
      this.churchSub.unsubscribe();
    }
  }
}
