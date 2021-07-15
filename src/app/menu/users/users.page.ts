import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EditUserPage } from './edit-user/edit-user.page';
import { NewUserPage } from './new-user/new-user.page';
import { StoreUser } from './storeUser.model';
import { UserService } from './user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  title = 'Users';
  users: StoreUser[];
  isLoading = false;
  private userSub: Subscription;


  constructor(
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private userService: UserService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.userSub = this.userService.user.subscribe(users => {
      this.users = users;
    });
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.userService.fetchUsers().subscribe(() => {
      this.isLoading = false;
    });
  }

  addUser(){
    this.modalCtrl
    .create({
      component: NewUserPage
    })
    .then((modalEl) => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then((resultData) => {
      if (resultData.role === 'confirm') {
        this.loadingCtrl
        .create({ message: 'Creating User'})
        .then((loadingEl) => {
          loadingEl.present();
          const data = resultData.data.userData;
          this.userService
          .signup(
            data.email,
            data.password,
            data.name,
            data.role,
            data.createdAt
          )
          .then(() => {
            loadingEl.dismiss();
          });
        });
      }
    });
  }


  onEdit(userId: string) {
    this.modalCtrl.create({
      component: EditUserPage,
      componentProps:{
        // eslint-disable-next-line quote-props
        // eslint-disable-next-line object-shorthand
        userId: userId
      }
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        this.userService.updateUser(
          userId,
          modalData.data.editUser.email,
          modalData.data.editUser.password,
          modalData.data.editUser.name,
          modalData.data.editUser.role
        ).subscribe(user => {
          this.users = [user];
        });
      });
      modalEl.present();
    });
  }

  onView(debtorId: string) {
    this.router.navigate(['/', 'menu', 'tabs', 'debtors', 'view', debtorId]);
  }

  onDeleteEntry(userId: string, event: any) {
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
                  this.userService.deleteUser(userId).subscribe(() => {
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
}
