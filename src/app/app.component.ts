import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor, Plugins } from '@capacitor/core';
import { MenuController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { SharedService } from './shared/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isVisible = true;
  lg: boolean;
  electron: boolean;

  private authSub: Subscription;
  private previousAuthState = false;


  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    public sharedService: SharedService,
    private menuCtrl: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')){
        Plugins.SplashScreen.hide();
      }
    });
  }

  ngOnInit(){
   this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
     if (!isAuth && this.previousAuthState !== isAuth) {
             this.router.navigateByUrl('/auth');
     }
     this.previousAuthState = isAuth;
    });

    this.sharedService.cast.subscribe(data => this.isVisible = data);

    if(window.screen.width <= 1024)
    {
      this.isVisible = false;
    }

    if(this.isElectron()){
      this.electron = true;
  }else{
    this.electron = false;
  }
  }

  isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}

  isToggle(){
    // this.sharedService.changeToggle();
    // return this.isVisible = false;
    console.log(this.isVisible);
    this.menuCtrl.toggle();
  }

  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(){
    if(!this.authSub) {
      this.authSub.unsubscribe();
    }
  }


}
