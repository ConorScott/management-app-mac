import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { Invoice } from '../invoice.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  coffinDetails: string;

  constructor(private renderer: Renderer2, public printer: Printer) {}

  ngOnInit() {
    this.coffinDetails = this.invoice.coffinDetails.split(' (')[0];
  }

  // printDiv(div) {
  //   const printContents = document.getElementById(div).innerHTML;
  //   const originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  //   document.body.innerHTML = originalContents;
  //   window.location.reload();
  // }

  printDiv(div) {
    this.printer.isAvailable().then((onSuccess: any) => {
    let content = document.getElementById(div).innerHTML;
    let options: PrintOptions = {
    name: 'MyDocument',
    duplex: true,
    orientation: "portrait",
    monochrome: true
    };
    this.printer.print(content, options).then((value: any) => {
    console.log('value:', value);
    }, (error) => {
    console.log('err:', error);
    });
    }, (err) => {
    console.log('err:', err);
    });
    }


}
