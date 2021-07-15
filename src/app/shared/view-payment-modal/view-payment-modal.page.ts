import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PaymentService } from 'src/app/menu/reports/payments/payment.service';
import { Payment } from '../payment.model';

@Component({
  selector: 'app-view-payment-modal',
  templateUrl: './view-payment-modal.page.html',
  styleUrls: ['./view-payment-modal.page.scss'],
})
export class ViewPaymentModalPage implements OnInit {
  payment: Payment;
  paymentId: string;
  isLoading = false;
  private paymentSub: Subscription;

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('paymentId')) {
        this.modalCtrl.dismiss();
        return;
      }
      this.paymentId = paramMap.get('paymentId');
      this.isLoading = true;
      this.paymentSub = this.paymentService
        .getPayments(paramMap.get('paymentId'))
        .subscribe((payment) => {
          this.payment = payment;
          this.isLoading = false;
        });
    });
  }

}
