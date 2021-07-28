import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Receipt } from '../receipt.model';
import { ReceiptService } from '../receipt.service';

@Component({
  selector: 'app-view-receipt-layout',
  templateUrl: './view-receipt-layout.page.html',
  styleUrls: ['./view-receipt-layout.page.scss'],
})
export class ViewReceiptLayoutPage implements OnInit {

  @Input() receiptId: string;
  modal: HTMLIonModalElement;
  receipt: Receipt;
  date = new Date();
  isLoading = false;
  private receiptSub: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private receiptService: ReceiptService
    ) { }

  ngOnInit() {
    console.log(this.receiptId);

    if (!this.receiptId) {
      this.navCtrl.navigateBack('/menu/tabs/reports/payments');
      return;
    }
    this.isLoading = true;
    this.receiptSub = this.receiptService
      .getDonations(this.receiptId)
      .subscribe(
        (receipt) => {
          this.receipt = receipt;
          this.isLoading = false;
        }
      );
  }

  // printDiv(div, receipt){
  //   this.receipts = receipt;
  //   console.log(this.receipts);
  //   const printContents = div;
  //    const originalContents = document.body.innerHTML;
  //     document.body.innerHTML = printContents;
  //    window.print();
  //    document.body.innerHTML = originalContents;
  //    window.location.reload();
  // }

  printDiv1(div){

    const printContents = document.getElementById(div).innerHTML;
     const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
     window.print();
     document.body.innerHTML = originalContents;
     window.location.reload();
  }

}
