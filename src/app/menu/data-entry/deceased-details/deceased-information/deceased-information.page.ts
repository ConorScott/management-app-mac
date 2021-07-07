import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Deceased } from '../deceased.model';
import { DeceasedService } from '../deceased.service';

@Component({
  selector: 'app-deceased-information',
  templateUrl: './deceased-information.page.html',
  styleUrls: ['./deceased-information.page.scss'],
})
export class DeceasedInformationPage implements OnInit {
  deceased: Deceased;
  deceasedId: string;
  formType: string;
  isLoading = false;
  private deceasedSub: Subscription;

  constructor(
    private deceasedService: DeceasedService,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('deceasedId')) {
        this.navCtrl.navigateBack('/menu/tabs/data-entry/deceased');
        return;
      }
      this.deceasedId = paramMap.get('deceasedId');
      this.formType = paramMap.get('formType');
      this.isLoading = true;
      this.deceasedSub = this.deceasedService
        .getDeceased(paramMap.get('deceasedId'))
        .subscribe((deceased) => {
          this.deceased = deceased;
          this.isLoading = false;
        });
    });
  }

  onEdit(deceasedId: string) {
    this.router.navigate([
      '/',
      'menu',
      'tabs',
      'data-entry',
      'deceased',
      'edit',
      deceasedId,
    ]);
    console.log('Editing item', deceasedId);
  }
}
