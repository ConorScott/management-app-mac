import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Tips } from '../tips.model';
import { TipsService } from '../tips.service';

@Component({
  selector: 'app-view-tip',
  templateUrl: './view-tip.page.html',
  styleUrls: ['./view-tip.page.scss'],
})
export class ViewTipPage implements OnInit {
  @Input() tipId;
  isLoading = false;
  tips: Tips;
  modal: HTMLIonModalElement;
  isGraveDigger = false;
  isSacristan = false;

  private tipSub: Subscription;

  constructor(
    private tipService: TipsService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    if (!this.tipId) {
      this.navCtrl.navigateBack('/menu/tabs/reports/donations');
      return;
    }

    this.isLoading = true;
    this.tipSub = this.tipService
    .getTips(this.tipId)
    .subscribe((tips) => {
      this.tips = tips;
      this.isLoading = false;
      if(this.tips.payeeName === 'Grave Diggers'){
        this.isGraveDigger = true;
      }
      if(this.tips.payeeName === 'Sacristan'){
        this.isSacristan = true;
      }
    });
  }

  onEditDonation(){
    this.modal.dismiss(
      {
        editTip: {
          tipId: this.tipId,
          action: 'edit'
        }
      },
      'confirm'
    );

  }

  onDeleteDonation(){
    this.modal.dismiss(
      {
        editTip: {
          tipId: this.tipId,
          action: 'delete'
        }
      },
      'confirm'
    );
  }

  onCancel(){
    this.modal.dismiss(null, 'cancel');
  }

}
