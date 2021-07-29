import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CashBook } from '../cashbbok.model';
import { CashbookService } from '../cashbook.service';

@Component({
  selector: 'app-view-cashbook',
  templateUrl: './view-cashbook.page.html',
  styleUrls: ['./view-cashbook.page.scss'],
})
export class ViewCashbookPage implements OnInit {
  @Input() cashbookId;
  isLoading = false;
  cashbook: CashBook;
  modal: HTMLIonModalElement;
  isGraveDigger = false;
  isSacristan = false;

  private cashbookSub: Subscription;

  constructor(
    private cashbookService: CashbookService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    if (!this.cashbookId) {
      this.navCtrl.navigateBack('/menu/tabs/reports/donations');
      return;
    }

    this.isLoading = true;
    this.cashbookSub = this.cashbookService
    .getCashBook(this.cashbookId)
    .subscribe((cashbook) => {
      this.cashbook = cashbook;
      this.isLoading = false;
      if(this.cashbook.payeeName === 'Grave Diggers'){
        this.isGraveDigger = true;
      }
      if(this.cashbook.payeeName === 'Sacristan'){
        this.isSacristan = true;
      }
    });
  }

  onEditDonation(){
    this.modal.dismiss(
      {
        editCashBook: {
          cashbookId: this.cashbookId,
          action: 'edit'
        }
      },
      'confirm'
    );

  }

  onDeleteDonation(){
    this.modal.dismiss(
      {
        editCashBook: {
          cashbookId: this.cashbookId,
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
