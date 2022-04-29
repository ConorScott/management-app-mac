import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ReceiptLayoutPage } from '../receipt-layout/receipt-layout.page';
import { Receipt } from '../receipt.model';
import { ReceiptService } from '../receipt.service';
import { ViewReceiptLayoutPage } from '../view-receipt-layout/view-receipt-layout.page';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { times } from 'src/fonts/times-normal.Base64.encoded';
import { timesBold } from 'src/fonts/times-bold.Base64.encoded';
import { helvetica } from 'src/fonts/helvetica-normal.Base64.encoded';
import { helveticaBold } from 'src/fonts/helvetica-bold.Base64.encoded';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DatePipe, DecimalPipe } from '@angular/common';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-view-receipt',
  templateUrl: './view-receipt.page.html',
  styleUrls: ['./view-receipt.page.scss'],
})
export class ViewReceiptPage implements OnInit {
  @ViewChild(ViewReceiptLayoutPage) child: ViewReceiptLayoutPage;
  @Input() receiptId;
  paymentId: string;
  isLoading = false;
  receipt: Receipt;
  payment: Receipt;
  newTotal: number;
  modal: HTMLIonModalElement;
  private receiptSub: Subscription;

  constructor(
    private receiptService: ReceiptService,
    private navCtrl: NavController,
    private file: File,
    private fileOpener: FileOpener,
    public printer: Printer,
    private _decimalPipe: DecimalPipe,

  ) { }

  ngOnInit() {
    if (!this.receiptId) {
      this.navCtrl.navigateBack('/menu/tabs/reports/receipt');
      return;
    }
    this.isLoading = true;
    this.receiptSub = this.receiptService
      .getDonations(this.receiptId)
      .subscribe(
        (receipt) => {
          this.receipt = receipt;
          this.paymentId = this.receipt.paymentId;
          this.isLoading = false;
        }
      );
  }

  onGenerateReceipt(action = "open"){
      this.receiptService.onGenerateReceipt(this.receipt);



    // let receiptAmount = this._decimalPipe.transform(this.receipt.amount, '1.2-2');


    // let date = new Date();
    // const receiptDate = new DatePipe('en-US').transform(
    //   date,
    //   'dd/MM/yyyy'
    // );
    // const paymentDate = new DatePipe('en-US').transform(
    //   this.receipt.paymentDate,
    //   'dd/MM/yyyy'
    // );
    // pdfFonts.pdfMake.vfs['times_b64']=times;
    // pdfFonts.pdfMake.vfs['timesBold_b64']=timesBold;
    // pdfFonts.pdfMake.vfs['Helvetica_b64']=helvetica;
    // pdfFonts.pdfMake.vfs['Helvetica-Bold_b64']=helveticaBold;
    // // pdfFonts.pdfMake.vfs['helveticaBold_b64']=timesBold

    // pdfMake.fonts = {
    //   courier: {
    //     normal: 'Courier',
    //     bold: 'Courier-Bold',
    //     italics: 'Courier-Oblique',
    //     bolditalics: 'Courier-BoldOblique',
    //   },
    //   Helvetica: {
    //     normal: 'Helvetica_b64',
    //     bold: 'Helvetica-Bold_b64',
    //     italics: 'Helvetica-Oblique',
    //     bolditalics: 'Helvetica-BoldOblique',
    //   },
    //   // eslint-disable-next-line @typescript-eslint/naming-convention
    //   Times: {
    //     normal: 'times_b64',
    //     bold: 'timesBold_b64',
    //     italics: 'times_b64',
    //     bolditalics: 'times_b64',
    //   },
    //   symbol: {
    //     normal: 'Symbol',
    //   },
    //   zapfDingbats: {
    //     normal: 'ZapfDingbats',
    //   },
    // };


    // // this.modal.dismiss(
    // //   {
    // //     receiptData: {

    // //       receipt: this.receipt
    // //     }
    // //   },
    // //   'confirm'
    // // );
    // // this.child.printDiv1(div);

    // const doc = {
    //   content: [
    //     {
    //       columns: [
    //         {
    //         text: `Receipt`,
    //         alignment: 'left',
    //         fontSize: 42,
    //         },
    //         {
    //           text: `${receiptDate}`,
    //           margin: [0, 20, 0, 0],
    //           alignment: 'left',
    //           fontSize: 14
    //         }
    //       ]

    //     },
    //     {
    //       columns: [
    //         {
    //           text: `Payee Name:`,
    //           margin: [22.5, 40, 0, 20],
    //           bold: true,
    //           alignment: 'left',
    //           fontSize: 14,
    //         },
    //         {
    //           text: `${this.receipt.payeeName}`,
    //           alignment: 'left',
    //           margin: [0, 40, 0, 20],
    //           fontSize: 14,
    //         }
    //       ],
    //     },
    //     {
    //       columns: [
    //         {
    //           text: `Payment Date:`,
    //           bold: true,
    //           alignment: 'left',
    //           margin: [22.5, 0, 0, 20],
    //           fontSize: 14,
    //         },
    //         {
    //           text: `${paymentDate}`,
    //           alignment: 'left',
    //           margin: [0, 0, 0, 20],
    //           fontSize: 14,
    //         }
    //       ],
    //     },
    //     {
    //       columns: [
    //         {
    //           text: `Payment Amount:`,
    //           bold: true,
    //           alignment: 'left',
    //           margin: [22.5, 0, 0, 20],
    //           fontSize: 14,
    //         },
    //         {
    //           text: `€${receiptAmount}`,
    //           alignment: 'left',
    //           margin: [0, 0, 0, 20],
    //           fontSize: 14,
    //         }
    //       ],
    //     },
    //     {
    //       columns: [
    //         {
    //           text: `Payment Method:`,
    //           bold: true,
    //           alignment: 'left',
    //           margin: [22.5, 0, 0, 20],
    //           fontSize: 14,
    //         },
    //         {
    //           text: `${this.receipt.paymentMethod}`,
    //           alignment: 'left',
    //           margin: [0, 0, 0, 20],
    //           fontSize: 14,
    //         }
    //       ],
    //     },
    //     {
    //       columns: [
    //         {
    //           text: `Received with thanks`,
    //           bold: true,
    //           alignment: 'left',
    //           margin: [30, 10, 0, 20],
    //           fontSize: 14,
    //         },
    //       ],
    //     },
    //     {
    //       columns: [
    //         {
    //           text: `Signed:`,
    //           bold: true,
    //           alignment: 'left',
    //           margin: [30, 0, 0, 20],
    //           fontSize: 14,
    //         },
    //       ],
    //     },

    // ],
    // defaultStyle: {
    //   font: 'Helvetica'
    // },
    // pageMargins: [100, 250, 50, 0]
    // }

    // if(this.isElectron()){
    //   if (action === 'download') {
    //     pdfMake.createPdf(doc).download();
    //   } else if (action === 'print') {
    //     pdfMake.createPdf(doc).print();
    //   } else {
    //     pdfMake.createPdf(doc).open();
    //   }
    // } else {
    //   this.printDiv(doc);
    // }
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

  onEditReceipt(){
    this.modal.dismiss(
      {
        editReceipt: {
          receiptId: this.receiptId,
          action: 'edit'
        }
      },
      'confirm'
    );

  }

  onDeleteReceipt(){
    this.modal.dismiss(
      {
        editReceipt: {
          receiptId: this.receiptId,
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
