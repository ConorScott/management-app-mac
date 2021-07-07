import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { StoreUser } from '../storeUser.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit{
  @Input() userId: string;
  user: StoreUser;
  modal: HTMLIonModalElement;
  form: FormGroup;
  isLoading = false;
  createdAt: Date;
  private userSub: Subscription;

  constructor(
    private userService: UserService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.userId) {
      this.navCtrl.navigateBack('/menu/tabs/users');
      return;
    }
    this.isLoading = true;
    this.userSub = this.userService.getUser(this.userId).subscribe(
      (user) => {
        this.user = user;
        this.form = new FormGroup({
          name: new FormControl(this.user.name, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          email: new FormControl(this.user.email, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          password: new FormControl(this.user.password, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          role: new FormControl(this.user.role, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
        });
        this.isLoading = false;
      },
      (error) => {
        this.alertCtrl
          .create({
            header: 'An error occurred!',
            message: 'User information could not be fetched. Please try again.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/menu/tabs/users']);
                },
              },
            ],
          })
          .then((alertEl) => {
            alertEl.present();
          });
      }
    );
  }

  onUpdateUser(){
    this.modal.dismiss(
      {
        editUser: {
          name: this.form.value.name,
          email: this.form.value.email,
          password: this.form.value.password,
          role: this.form.value.role,
        }
      },
      'confirm'
    );
    this.form.reset();
}

  onCancel() {
    this.modal.dismiss(null, 'cancel');
  }

}
