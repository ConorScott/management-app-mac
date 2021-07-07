import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {}

  ionViewWillEnter(){
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);
  }

  ionViewWillLeave(){
    this.menuCtrl.enable(true);
    this.menuCtrl.swipeGesture(true);
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then((loadingEl) => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signUp(email, password);
        }
        authObs.subscribe(
          (resData) => {
            setTimeout(() => {
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/menu');
            }, 2000);
          },
          (errRes) => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not sign you up';
            if (code === 'EMAIL_EXISTS') {
              message = 'This email address already exists';
            } else if (code === 'EMAIL_NOT_FOUND') {
              message = 'E-Mail address could not be found';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'This password is not correct';
            }
            this.showAlert(message);
          }
        );
      });
    this.router.navigateByUrl('/menu/tabs/data-entry');
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
    form.reset();
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message,
        buttons: ['Okay'],
      })
      .then((alertEl) => alertEl.present());
  }

}
