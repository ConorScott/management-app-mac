import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ReceiptLayoutPage } from '../receipt-layout/receipt-layout.page';
import { Receipt } from '../receipt.model';
import { ReceiptService } from '../receipt.service';
import { ViewReceiptLayoutPage } from '../view-receipt-layout/view-receipt-layout.page';

@Component({
  selector: 'app-view-receipt',
  templateUrl: './view-receipt.page.html',
  styleUrls: ['./view-receipt.page.scss'],
})
export class ViewReceiptPage implements OnInit {
  @ViewChild(ViewReceiptLayoutPage) child: ViewReceiptLayoutPage;
  @Input() receiptId;
  paymentId: string;
  isLoading = false;
  receipt: Receipt;
  payment: Receipt;
  newTotal: number;
  modal: HTMLIonModalElement;
  private receiptSub: Subscription;

  constructor(
    private receiptService: ReceiptService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    if (!this.receiptId) {
      this.navCtrl.navigateBack('/menu/tabs/reports/receipt');
      return;
    }
    this.isLoading = true;
    this.receiptSub = this.receiptService
      .getDonations(this.receiptId)
      .subscribe(
        (receipt) => {
          this.receipt = receipt;
          this.paymentId = this.receipt.paymentId;
          this.isLoading = false;
        }
      );
  }

  onGenerateReceipt(div){

    this.modal.dismiss(
      {
        receiptData: {

          receipt: this.receipt
        }
      },
      'confirm'
    );
    this.child.printDiv1(div);

  }

  onEditReceipt(){
    this.modal.dismiss(
      {
        editReceipt: {
          receiptId: this.receiptId,
          action: 'edit'
        }
      },
      'confirm'
    );

  }

  onDeleteReceipt(){
    this.modal.dismiss(
      {
        editReceipt: {
          receiptId: this.receiptId,
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
