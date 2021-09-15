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

}
