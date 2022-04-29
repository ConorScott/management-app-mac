import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Payment } from 'src/app/shared/payment.model';
import { ReceiptLayoutPage } from '../../receipts/receipt-layout/receipt-layout.page';
import { ReceiptService } from '../../receipts/receipt.service';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.page.html',
  styleUrls: ['./view-payment.page.scss'],
})
export class ViewPaymentPage implements OnInit {
  @ViewChild(ReceiptLayoutPage) child: ReceiptLayoutPage;
  @Input() paymentId;
  @Input() debtorId;
  isLoading = false;
  payments: Payment[];
  payment: Payment;
  newTotal: number;
  modal: HTMLIonModalElement;
  private paymentSub: Subscription;

  constructor(
    private paymentService: PaymentService,
    private receiptService: ReceiptService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router
    ) { }

  ngOnInit() {
    // this.paymentSub = this.paymentService.payment.subscribe((payment) => {
    //   this.payments = payment;
    //   this.payments.reduce((acc, val) => this.newTotal = acc += val.amount, 0);
    // });
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

  ionViewWillEnter() {
    // this.paymentService.fetchAllPayments().subscribe(() => {
    // });
  }

  onGenerateReceipt(){
    this.receiptService.addDebtorReceipt(this.payment, this.debtorId).subscribe();

    this.receiptService.onGenerateReceipt(this.payment);

    this.modal.dismiss(null, 'confirm');
    // this.child.printDiv1(div);

  }

  onDeletePayment(){
    this.modal.dismiss(
      {
        editPayment: {
          paymentId: this.paymentId,
          debtorId: this.debtorId,
          paymentAmount: this.payment.amount,
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
