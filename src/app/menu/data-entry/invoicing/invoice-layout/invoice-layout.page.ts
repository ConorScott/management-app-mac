import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Invoice } from '../invoice.model';

@Component({
  selector: 'app-invoice-layout',
  templateUrl: './invoice-layout.page.html',
  styleUrls: ['./invoice-layout.page.scss'],
})
export class InvoiceLayoutPage implements OnInit {
  @Input() invoice: Invoice;
  price: string;
  servicesPrice: string;
  coffinPrice: string;
  casketCoverPrice: string;
  coronerDoctorCertPrice: string;
  cremationPrice: string;
  urnPrice: string;
  churchOfferringPrice: string;
  sacristianPrice: string;
  flowersPrice: string;
  graveOpenPrice: string;
  gravePurchasePrice: string;
  graveMarkerPrice: string;
  graveMatsTimbersPrice: string;
  clothsPrice: string;
  hairdresserPrice: string;
  radioNoticePrice: string;
  paperNoticePrice: string;
  organistPrice: string;
  soloistPrice: string;
  otherDetailsPrice: string;
  totalBalance: string;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
  }

  printDiv(div) {
    const printContents = document.getElementById(div).innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }
}
