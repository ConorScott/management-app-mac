import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TipPayee } from '../tip-payee.model';
import { TipPaymentsService } from '../tip-payments.service';
import { Tips } from '../tips.model';
import { TipsService } from '../tips.service';


@Component({
  selector: 'app-tip-stats',
  templateUrl: './tip-stats.page.html',
  styleUrls: ['./tip-stats.page.scss'],
})
export class TipStatsPage implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  @Input() rayTotal;
  @Input() kieranTotal;
  @Input() terryTotal;
  @Input() brianTotal;
  @Input() stAnnesTotal;
  @Input() otherTotal;
  @Input() overallTotal;
  @Input() tips: Tips[];
  @Input() tipPayment: boolean;

  filteredTips = [];
  tipPayees: TipPayee[];
  paymentTotal: number;
  amount: string;
  otherValue: number;
  totals = [];
  isLoading = false;

  modal: HTMLIonModalElement;

  private tipPayeeSub: Subscription;


  constructor(private tipService: TipsService, private tipPaymentService: TipPaymentsService) { }

  ngOnInit() {
    if(this.tipPayment){
    this.tipPayeeSub = this.tipPaymentService.tipPayee.subscribe((payee) => {
      this.tipPayees = payee;
      payee.reduce((acc, val) => (this.paymentTotal = acc + val.balance), 0);
      console.log(this.tipPayees);
    });
    } else {
      this.filter();

    this.tips.forEach(tip => {
    this.tipService.fetchTotalPayments(tip.payeeName).subscribe((total) => {
      // console.log(total);


      total.reduce((acc, val) => (this.otherValue = acc + val.entryAmount), 0);
      console.log(this.otherValue);
      this.filteredTips.push({payeeName: tip.payeeName, entryAmount : this.otherValue});


      // this.totals.push(tip.entryAmount);
    });

    });
    this.isLoading = false;
    this.totals = this.filteredTips;
    console.log(this.filteredTips);
    }




  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.tipPaymentService.fetchTipPayee().subscribe(() => {
      this.isLoading = false;
    });
  }

  filter(){
    this.tips = this.tips.reduce((a, b) => {
      if(!a.find(data => data.payeeName === b.payeeName)){

        a.push(b);
      }
      return a;

    }, []);
  }

  onCancel(){
    this.modal.dismiss();
  }

}
