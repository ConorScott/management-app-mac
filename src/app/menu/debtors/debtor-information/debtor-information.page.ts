/* eslint-disable arrow-body-style */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Debtor } from '../debtor.model';
import { DebtorService } from '../debtor.service';
import { PaymentModalComponent } from 'src/app/shared/payment-modal/payment-modal.component';
import { Payment } from 'src/app/shared/payment.model';
import { ThrowStmt } from '@angular/compiler';
import { EditPaymentModalPage } from 'src/app/shared/edit-payment-modal/edit-payment-modal.page';

@Component({
  selector: 'app-debtor-information',
  templateUrl: './debtor-information.page.html',
  styleUrls: ['./debtor-information.page.scss'],
})
export class DebtorInformationPage implements OnInit, OnDestroy {
  debtor: Debtor;
  debtorId: string;
  payments: Payment[];
  filteredPayments: Payment[];
  newBalance: number;
  isLoading = false;
  segment = 'information';
  private debtorSub: Subscription;

  constructor(
    private debtorService: DebtorService,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('debtorId')) {
        this.navCtrl.navigateBack('/menu/tabs/debtors');
        return;
      }
      this.debtorId = paramMap.get('debtorId');
      this.isLoading = true;
      this.debtorSub = this.debtorService
        .getDebtor(paramMap.get('debtorId'))
        .subscribe((debtor) => {
          this.debtor = debtor;
          this.debtorService.fetchPayments(this.debtorId).subscribe(payment => {
            this.payments = payment;
            this.filteredPayments = payment;
          });
          this.isLoading = false;
        });
    });
  }

  presentModal(){
    this.modalCtrl.create({
      component: PaymentModalComponent,
      componentProps:{
        // eslint-disable-next-line quote-props
        'totalBalance': this.debtor.totalBalance
      }
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        console.log(modalData.data.paymentData.paymentMethod);
        // this.newBalance = this.debtor.totalBalance - modalData.data.paymentData.amount;
        this.debtorService.updateDebtor(
          this.debtorId,
          this.newBalance,
          modalData.data.paymentData
        ).subscribe(debtor => {
          this.debtor = debtor;
        });
      });
      modalEl.present();
    });
  }

  // editPayment(){
  //   this.modalCtrl.create({
  //     component: EditPaymentModalPage,
  //     componentProps:{
  //       // eslint-disable-next-line quote-props
  //       'debtorId': this.debtor.id
  //     }
  //   }).then(modalEl => {
  //     modalEl.onDidDismiss().then(modalData => {
  //       if (!modalData.data) {
  //         return;
  //       }
  //       console.log(modalData.data.paymentData.paymentMethod);
  //       this.debtorService.updatePayment(
  //         this.debtorId,
  //         modalData.data.paymentData.paymentDate,
  //         modalData.data.paymentData.amount,
  //         modalData.data.paymentData.paymentMethod,
  //         modalData.data.paymentData.payeeName
  //       ).subscribe(debtor => {
  //         this.payments = debtor;
  //       });
  //     });
  //     modalEl.present();
  //   });
  // }

  onChange(event) {
    const filteration = event.target.value;
    this.payments = this.filterSearch(filteration);
    if (filteration.length === 0) {
      this.payments = this.filteredPayments;
    }
  }

  filterSearch(searchTerm) {
    return this.payments.filter((item) => {
      return (
        item.payeeName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      );
    });
  }

  ngOnDestroy() {
    if (this.debtorSub) {
      this.debtorSub.unsubscribe();
    }
  }

}
