import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Payment } from 'src/app/shared/payment.model';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.page.html',
  styleUrls: ['./view-payment.page.scss'],
})
export class ViewPaymentPage implements OnInit {

  payments: Payment[];
  newTotal: number;
  private paymentSub: Subscription;

  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    this.paymentSub = this.paymentService.payment.subscribe((payment) => {
      this.payments = payment;
      this.payments.reduce((acc, val) => this.newTotal = acc += val.amount, 0);
    });
  }

  ionViewWillEnter() {
    this.paymentService.fetchAllPayments().subscribe(() => {
    });
  }
}
