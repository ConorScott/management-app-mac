import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Payment } from 'src/app/shared/payment.model';
import { PaymentService } from '../../payments/payment.service';
import { Receipt } from '../receipt.model';

@Component({
  selector: 'app-receipt-layout',
  templateUrl: './receipt-layout.page.html',
  styleUrls: ['./receipt-layout.page.scss'],
})
export class ReceiptLayoutPage implements OnInit {

  @Input() paymentId: string;
  receipts: Receipt;
  modal: HTMLIonModalElement;
  payment: Payment;
  date = new Date();
  isLoading = false;
  private paymentSub: Subscription;

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private paymentService: PaymentService
    ) { }

  ngOnInit() {
    console.log(this.paymentId);

    if (!this.paymentId) {
      this.navCtrl.navigateBack('/menu/tabs/reports/payments');
      return;
    }
    this.isLoading = true;
    this.paymentSub = this.paymentService
      .getPayments(this.paymentId)
      .subscribe(
        (payment) => {
          this.payment = payment;
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
