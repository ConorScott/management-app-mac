import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  constructor(private authService: AuthService, public popController: PopoverController) { }

  ngOnInit() {}

  dismissPopover(){
    this.popController.dismiss();
  }

  logout(){
    this.popController.dismiss();
  this.authService.logout();
  }
}
