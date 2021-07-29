import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-stats',
  templateUrl: './payment-stats.page.html',
  styleUrls: ['./payment-stats.page.scss'],
})
export class PaymentStatsPage implements OnInit {
  @Input() cashTotal;
  @Input() cardTotal;
  @Input() eftTotal;
  @Input() chequeTotal;
  @Input() draftTotal;
  @Input() overallTotal;
  modal: HTMLIonModalElement;


  constructor() { }

  ngOnInit() {
  }

  onCancel(){
    this.modal.dismiss();
  }

}
