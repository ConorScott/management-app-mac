import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Invoice } from '../invoice.model';
import { InvoiceService } from '../invoice.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import {times} from  '../../../../../fonts/times-normal.Base64.encoded';
import {timesBold} from  '../../../../../fonts/times-bold.Base64.encoded';
import { DatePipe, DecimalPipe } from '@angular/common';
import { InvoiceLayoutPage } from '../invoice-layout/invoice-layout.page';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { DeceasedService } from '../../deceased-details/deceased.service';
import { CoffinService } from 'src/app/menu/coffin-stock/coffin.service';
import { UserService } from 'src/app/menu/users/user.service';
import { helvetica } from '../../../../../fonts/helvetica-normal.Base64.encoded';
import { helveticaBold } from '../../../../../fonts/helvetica-bold.Base64.encoded';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-invoice-information',
  templateUrl: './invoice-information.page.html',
  styleUrls: ['./invoice-information.page.scss'],
})
export class InvoiceInformationPage implements OnInit {
  @ViewChild(InvoiceLayoutPage) child: InvoiceLayoutPage;
  invoice: Invoice;
  address1: string;
  address2: string;
  address3: string;
  county: string;
  invoiceId: string;
  userName: string;
  isLoading = false;
  private invoiceSub: Subscription;

  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private deceasedService: DeceasedService,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private coffinService: CoffinService,
    private _decimalPipe: DecimalPipe,
    private file: File,
    private fileOpener: FileOpener,
    public printer: Printer

  ) {}

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('invoiceId')) {
        this.navCtrl.navigateBack('/menu/tabs/data-entry/invoicing');
        return;
      }
      this.invoiceId = paramMap.get('invoiceId');
      this.isLoading = true;
      this.invoiceSub = this.invoiceService
        .getInvoices(paramMap.get('invoiceId'))
        .subscribe((invoice) => {
          this.invoice = invoice;
          this.fetchAddress(invoice);
          this.isLoading = false;

        });
    });
    console.log(this.invoice);
  }

  onEdit(invoiceId: string) {
    this.router.navigate([
      '/',
      'menu',
      'tabs',
      'data-entry',
      'invoicing',
      'edit',
      invoiceId,
    ]);
    console.log('Editing item', invoiceId);
  }

  fetchAddress(invoice){
    console.log('invoice');
    console.log(invoice);
    this.deceasedService
            .fetchDeceasedAddress(
              invoice.deceasedName,
              invoice.responsible
            )
            .subscribe((deceased) => {
              deceased.map((info) => {
                console.log(info);
                this.invoice.address1 = info.address1;
                this.invoice.address2 = info.address2;
                this.invoice.address3 = info.address3;
                this.invoice.county = info.county;
              });
            });
  }

  generatePDF(action = 'open') {
    var body = [];
    body.push(['','']);
    if (this.invoice.servicesPrice){
      let servicesPrice = this._decimalPipe.transform(this.invoice.servicesPrice, '1.2-2');

      body.push([`Services\n\n ${this.invoice.services}`, {text:`€${servicesPrice}`, alignment: 'right'}])
    }
    if (this.invoice.coffinPrice){
      let coffinDetails = this.invoice.coffinDetails.split(" (")
      let coffinPrice = this._decimalPipe.transform(this.invoice.coffinPrice, '1.2-2');
      body.push([`Coffin: ${coffinDetails[0]}`, {text:`€${coffinPrice}`, alignment: 'right'}])
    }
    if (this.invoice.coronerDoctorCertPrice){
      let coronerDoctorCertPrice = this._decimalPipe.transform(this.invoice.coronerDoctorCertPrice, '1.2-2');
      body.push(['Coroner/Doctor Cert:', {text:`€${coronerDoctorCertPrice}`, alignment: 'right'}])
    }
    if (this.invoice.cremationPrice){
      let cremationPrice = this._decimalPipe.transform(this.invoice.cremationPrice, '1.2-2');
      body.push(['Cremation:', {text:`€${cremationPrice}`, alignment: 'right'}])

    }
    if (this.invoice.urnPrice){
      let urnPrice = this._decimalPipe.transform(this.invoice.urnPrice, '1.2-2');
      body.push(['Urn:', {text:`€${urnPrice}`, alignment: 'right'}])

    }
    if (this.invoice.churchOfferringPrice){
      let churchOfferringPrice = this._decimalPipe.transform(this.invoice.churchOfferringPrice, '1.2-2');
      body.push(['Church Offerring:', {text:`€${churchOfferringPrice}`, alignment: 'right'}])

    }
    if (this.invoice.sacristianPrice){
      let sacristianPrice = this._decimalPipe.transform(this.invoice.sacristianPrice, '1.2-2');
      body.push(['Sacristian:', {text:`€${sacristianPrice}`, alignment: 'right'}])

    }
    if (this.invoice.flowersPrice){
      let flowersPrice = this._decimalPipe.transform(this.invoice.flowersPrice, '1.2-2');
      body.push(['Flowers:', {text:`€${flowersPrice}`, alignment: 'right'}])

    }
    if (this.invoice.graveOpenPrice){
      let graveOpenPrice = this._decimalPipe.transform(this.invoice.graveOpenPrice, '1.2-2');
      body.push(['Grave Open:', {text:`€${graveOpenPrice}`, alignment: 'right'}])

    }
    if (this.invoice.gravePurchasePrice){
      let gravePurchaseToCouncil = this._decimalPipe.transform(this.invoice.gravePurchasePrice, '1.2-2');
      body.push(['Grave Purchase To Council:', {text:`€${gravePurchaseToCouncil}`, alignment: 'right'}])

    }
    if (this.invoice.graveMarkerPrice){
      let graveMarkerPrice = this._decimalPipe.transform(this.invoice.graveMarkerPrice, '1.2-2');
      body.push(['Grave Marker:', {text:`€${graveMarkerPrice}`, alignment: 'right'}])

    }
    if (this.invoice.graveMatsTimbersPrice){
      let graveMatsTimbersPrice = this._decimalPipe.transform(this.invoice.graveMatsTimbersPrice, '1.2-2');
      body.push(['Grave Mats & Timbers:', {text:`€${graveMatsTimbersPrice}`, alignment: 'right'}])

    }
    if (this.invoice.clothsPrice){
      let clothsPrice = this._decimalPipe.transform(this.invoice.clothsPrice, '1.2-2');
      body.push(['Clothes:', {text:`€${clothsPrice}`, alignment: 'right'}])

    }
    if (this.invoice.hairdresserPrice){
      let hairdresserPrice = this._decimalPipe.transform(this.invoice.hairdresserPrice, '1.2-2');
      body.push(['Hairdresser:', {text:`€${hairdresserPrice}`, alignment: 'right'}])

    }
    if (this.invoice.radioNoticePrice){
      let radioNoticePrice = this._decimalPipe.transform(this.invoice.radioNoticePrice, '1.2-2');
      body.push(['Radio Death Notices:', {text:`€${radioNoticePrice}`, alignment: 'right'}])

    }
    if (this.invoice.paperNoticePrice){
      let paperNoticePrice = this._decimalPipe.transform(this.invoice.paperNoticePrice, '1.2-2');
      body.push(['Paper Death Notices:', {text:`€${paperNoticePrice}`, alignment: 'right'}])

    }
    if (this.invoice.organistPrice){
      let organistPrice = this._decimalPipe.transform(this.invoice.organistPrice, '1.2-2');
      body.push(['Organist:', {text:`€${organistPrice}`, alignment: 'right'}])

    }
    if (this.invoice.soloistPrice){
      let soloistPrice = this._decimalPipe.transform(this.invoice.soloistPrice, '1.2-2');
      body.push(['Soloist:', {text:`€${soloistPrice}`, alignment: 'right'}])

    }
    if (this.invoice.otherDetailsPrice){
      let otherDetailsPrice = this._decimalPipe.transform(this.invoice.otherDetailsPrice, '1.2-2');
      body.push([`Other Details\n\n ${this.invoice.otherDetails}`, {text:`€${otherDetailsPrice}`, alignment: 'right'}])

    }
    if (this.invoice.totalBalance){
      let totalBalance = this._decimalPipe.transform(this.invoice.totalBalance, '1.2-2');
      body.push(['Total Balance:', {text:`€${totalBalance}`, alignment: 'right'}])

    }
    console.log('body');

    console.log(body);
    //image location
    const dateSendingToServer = new DatePipe('en-US').transform(
      this.invoice.invoiceDate,
      'dd/MM/yyyy'
    );
    const deathDate = new DatePipe('en-US').transform(
      this.invoice.deathDate,
      'dd/MM/yyyy'
    );
    console.log(dateSendingToServer);

    pdfFonts.pdfMake.vfs['times_b64']=times;
    pdfFonts.pdfMake.vfs['timesBold_b64']=timesBold;
    pdfFonts.pdfMake.vfs['Helvetica_b64']=helvetica;
    pdfFonts.pdfMake.vfs['Helvetica-Bold_b64']=helveticaBold;
    // pdfFonts.pdfMake.vfs['helveticaBold_b64']=timesBold

    pdfMake.fonts = {
      courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique',
      },
      Helvetica: {
        normal: 'Helvetica_b64',
        bold: 'Helvetica-Bold_b64',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Times: {
        normal: 'times_b64',
        bold: 'timesBold_b64',
        italics: 'times_b64',
        bolditalics: 'times_b64',
      },
      symbol: {
        normal: 'Symbol',
      },
      zapfDingbats: {
        normal: 'ZapfDingbats',
      },
    };

    const doc = {
      content: [
          {
            columns: [
              {
              text: `Reps ${this.invoice.responsible}`,
              bold: true,
              alignment: 'left',
              margin: [0, 0, 0, 20],
              fontSize: 21,
              }
            ]

          },
          {
            columns: [
              {
                text: `Invoice Date: ${dateSendingToServer}`,
                bold: true,
                alignment: 'left',
                margin: [0, 0, 0, 20],
                fontSize: 21,
              }
            ]
          },
          {
            columns: [
              {
                text: 'FUNERAL EXPENSES OF THE LATE',
                alignment: 'left',
                margin: [0, 0, 0, 20],
                fontSize: 21,
              }
            ]
          },
          {
            columns: [
              {
                text: `${this.invoice.deceasedName}`,
                alignment: 'left',
                margin: [125, 0, 0, 2],
                fontSize: 27,
              }
            ]
          },
          {
            columns: [
              {
                text: `${this.invoice.address1}, ${this.invoice.address2}, ${this.invoice.address3}, ${this.invoice.county}`,
                alignment: 'left',
                margin: [125, 18, 0, 2],
                fontSize: 18,
              }
            ]
          },
          {
            columns: [
              {
                text: `Date of Death: ${deathDate}`,
                alignment: 'left',
                margin: [125, 18, 0, 10],
                fontSize: 18,
              }
            ]
          },
          {
            style: 'tableExample',
            table: {
              widths: [400, '*'],
              alignment:['left','right'],
               body: body
              //[
              //   ['', ''],
              //   [`Services\n ${this.invoice.services}`, `${this.invoice.servicesPrice}`],
              //   [`Coffin Details: ${this.invoice.coffinDetails}`, `${this.invoice.coffinPrice}`],
              //   ['Coroner/Doctor Cert:', `${this.invoice.coronerDoctorCertPrice}`],
              //   ['Cremation:', `${this.invoice.cremationPrice}`],
              //   ['Urn:', `${this.invoice.urnPrice}`],
              //   ['Church Offerring:', `${this.invoice.churchOfferringPrice}`],
              //   ['Sacristian:', `${this.invoice.sacristianPrice}`],
              //   ['Flowers:', `${this.invoice.flowersPrice}`],
              //   ['Grave Open:', `${this.invoice.graveOpenPrice}`],
              //   ['Grave Purchase To Council:', `${this.invoice.gravePurchaseToCouncil}`],
              //   ['Grave Marker:', `${this.invoice.graveMarkerPrice}`],
              //   ['Grave Mats & Timbers:', `${this.invoice.graveMatsTimbersPrice}`],
              //   ['Clothes:', `${this.invoice.clothsPrice}`],
              //   ['Hairdresser:', `${this.invoice.hairdresserPrice}`],
              //   ['Radio Death Notices:', `${this.invoice.radioNoticePrice}`],
              //   ['Paper Death Notices:', `${this.invoice.paperNoticePrice}`],
              //   ['Organist:', `${this.invoice.organistPrice}`],
              //   ['Soloist:', `${this.invoice.soloistPrice}`],
              //   [`Other Details\n ${this.invoice.otherDetails}`, `${this.invoice.otherDetailsPrice}`],
              //   ['Total Balance:', `${this.invoice.totalBalance}`],
              // ]
            },
            layout: 'lightHorizontalLines'
          }
      ],
      styles: {
        header: {
          fontSize: 21,
          bold: true
        },
        tableExample: {
          margin: [0, 5, 0, 15],
          fontSize: 11
        },
      },
      defaultStyle: {
        font: 'Helvetica'
      },
      pageMargins: [30, 30, 30, 30]
    };

    if(this.isElectron()){
      if (action === 'download') {
        pdfMake.createPdf(doc).download();
      } else if (action === 'print') {
        pdfMake.createPdf(doc).print();
      } else {
        pdfMake.createPdf(doc).open();
      }
    } else {
      this.printDiv(doc);
    }

  }
  onDeleteInvoice() {
    this.actionSheetCtrl
      .create({
        header: 'Delete Invoice?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Invoice...' })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.updateCoffin();
                  this.invoiceService.cancelBooking(this.invoiceId).subscribe(() => {
                    loadingEl.dismiss();
                    this.router.navigate(['/menu/tabs/data-entry/invoicing']);
                  });
                });
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  updateCoffin(){
    let stockLocation: string;
    const coffinName = this.invoice.coffinDetails.split(' (')[0];
    const location = this.invoice.coffinDetails.split('(')[1];
    if (location === 'Sligo)') {
      stockLocation = 'sligo';
    } else if (location === 'Ballina)') {
      stockLocation = 'ballina';
    }
    this.coffinService.getCoffinId(coffinName, stockLocation)
    .subscribe((coffins) => {
      console.log(coffins);
      coffins.map((id) => {
        console.log(id.id);
        this.coffinService
          .updateAddCoffin(id.id, coffinName, id.stockLevel, id.stockLocation)
          .subscribe();
      });

    });;
  }

  printDiv(div) {
    // const printContents = document.getElementById(div).innerHTML;
    //  const originalContents = document.body.innerHTML;
    //  document.body.innerHTML = printContents;
    //  window.print();
    //  document.body.innerHTML = originalContents;
    const pdfObj = pdfMake.createPdf(div);
    pdfObj.getBuffer(async (buffer) => {
      const blob = new Blob([buffer], { type: 'application/pdf' });
        const fileName = 'someNameHere.pdf';
        await this.file.writeFile(this.file.dataDirectory, fileName, blob, { replace: true });
        await this.printer.print(this.file.dataDirectory + fileName);
    });
  }

  printDiv1(div, action = 'open') {
    // if (action === 'download') {
    //   pdfMake.createPdf(div).download();
    // } else if (action === 'print') {
    //   pdfMake.createPdf(div).print();
    // } else {
    //   pdfMake.createPdf(div).open();
    // }
    this.child.printDiv(div);
  }

  isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}
}
