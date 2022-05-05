import { Component, OnInit } from '@angular/core';
import { UserService } from './users/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  electron: boolean;
  mobile: boolean;
  role: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    if(window.screen.width < 1025) {
      this.mobile = true;
    }
    this.userService.getUserName().subscribe(name => {
      console.log(name);
      name.map(user => {
        this.role = user.role;
        console.log(this.role);
      });
    });
  }

//   isElectron() {
//     // Renderer process
//     if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
//         return true;
//     }

//     // Main process
//     if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
//         return true;
//     }

//     // Detect the user agent when the `nodeIntegration` option is set to true
//     if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
//         return true;
//     }

//     return false;
// }

}
