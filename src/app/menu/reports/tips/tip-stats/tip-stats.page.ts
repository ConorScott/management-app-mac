import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tip-stats',
  templateUrl: './tip-stats.page.html',
  styleUrls: ['./tip-stats.page.scss'],
})
export class TipStatsPage implements OnInit {
  @Input() rayTotal;
  @Input() kieranTotal;
  @Input() terryTotal;
  @Input() brianTotal;
  @Input() stAnnesTotal;
  @Input() otherTotal;
  @Input() overallTotal;
  otherValue: number;

  modal: HTMLIonModalElement;


  constructor() { }

  ngOnInit() {
    console.log(this.rayTotal);
    this.otherTotal = this.overallTotal - (this.rayTotal + this.kieranTotal + this.terryTotal + this.brianTotal + this.stAnnesTotal);
  }

  onCancel(){
    this.modal.dismiss();
  }

}
