import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  title = 'Reports';
  navLinks: any[];
  activeLinkIndex = -1;

  constructor(private router: Router) {
    this.navLinks = [
      {
        label: 'Payments',
        link: 'payments',
        index: 0
      },
      {
        label: 'Receipts',
        link: 'receipt',
        index: 1
      },
      {
        label: 'Coffin Sales',
        link: 'coffin-sales',
        index: 2
      }
    ];
   }

  ngOnInit(): void {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find((tab) => tab.link === '.' + this.router.url));
    });
  }

}
