import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.page.html',
  styleUrls: ['./data-entry.page.scss'],
})
export class DataEntryPage implements OnInit {
  title = 'Data Entry';
  isVisible: boolean;
  navLinks: any[];
  activeLinkIndex = -1;

  constructor(private router: Router, private sharedService: SharedService, private menuCtrl: MenuController) {
    this.navLinks = [
      {
        label: 'Deceased',
        link: 'deceased',
        index: 0,
      },
      {
        label: 'Invoicing',
        link: 'invoicing',
        index: 1,
      },
      {
        label: 'Cemetery',
        link: 'cemetery-list',
        index: 2,
      },
      {
        label: 'Church',
        link: 'church-list',
        index: 3,
      },
    ];
  }

  ngOnInit(): void {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(
        this.navLinks.find((tab) => tab.link === '.' + this.router.url)
      );
    });
    this.sharedService.cast.subscribe(data => this.isVisible = data);
  }

  isToggle(){
    this.sharedService.changeToggle();
    console.log('TWO: ' + this.isVisible);
    // this.menuCtrl.toggle('menu');
    // console.log('hello');
  }
}
