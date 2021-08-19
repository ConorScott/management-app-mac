import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TipPayments } from '../tip-payments.model';
import { TipPaymentsService } from '../tip-payments.service';
import { Tips } from '../tips.model';
import { TipsService } from '../tips.service';

@Component({
  selector: 'app-view-tip',
  templateUrl: './view-tip.page.html',
  styleUrls: ['./view-tip.page.scss'],
})
export class ViewTipPage implements OnInit {
  @Input() tipId;
  @Input() type;
  isLoading = false;
  tips: Tips;
  tipPayments: TipPayments;
  modal: HTMLIonModalElement;
  isGraveDigger = false;
  isSacristan = false;

  private tipSub: Subscription;

  constructor(
    private tipService: TipsService,
    private tipPaymentService: TipPaymentsService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    if (!this.tipId) {
      this.modal.dismiss();
      return;
    }
    if(this.type === 'tip'){
      this.isLoading = true;
      this.tipSub = this.tipService
      .getTips(this.tipId)
      .subscribe((tips) => {
        this.tips = tips;
        this.isLoading = false;
      });
    } else if (this.type === 'tipPayment'){
      this.isLoading = true;
    this.tipSub = this.tipPaymentService
    .getTips(this.tipId)
    .subscribe((tips) => {
      this.tipPayments = tips;
      this.isLoading = false;
    });
    }

  }

  onEditDonation(){
    this.modal.dismiss(
      {
        editTip: {
          tipId: this.tipId,
          action: 'edit',
          type: 'tip'
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
          action: 'delete',
          type: 'tip'
        }
      },
      'confirm'
    );
  }

  onEditTipPayment(){
    this.modal.dismiss(
      {
        editTip: {
          tipId: this.tipId,
          action: 'edit',
          type: 'tipPayment'
        }
      },
      'confirm'
    );

  }

  onDeleteTipPayment(){
    this.modal.dismiss(
      {
        editTip: {
          tipId: this.tipId,
          action: 'delete',
          type: 'tipPayment'
        }
      },
      'confirm'
    );
  }

  onCancel(){
    this.modal.dismiss(null, 'cancel');
  }

}
