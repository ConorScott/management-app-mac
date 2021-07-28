import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { UserService } from 'src/app/menu/users/user.service';
import { PopoverComponent } from '../popover/popover.component';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss'],
})
export class HeaderPage implements OnInit {
  @Input() title: string;
  name: string;
  isVisible: boolean;
  constructor(private sharedService: SharedService, public popController: PopoverController, private userService: UserService) { }

  ngOnInit() {
    this.sharedService.cast.subscribe(data => this.isVisible = data);
    this.userService.getUserName().subscribe(name => {
      console.log(name);
      name.map(user => {
        this.name = user.name;
        console.log(this.name);
      });
    });
  }
  isToggle(){
    this.sharedService.changeToggle();
    console.log('TWO: ' + this.isVisible);
    // this.menuCtrl.toggle('menu');
    // console.log('hello');
  }

  async presentPopover(ev: any) {
    const popover = await this.popController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
