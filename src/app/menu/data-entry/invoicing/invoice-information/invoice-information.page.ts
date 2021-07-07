import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Invoice } from '../invoice.model';
import { InvoiceService } from '../invoice.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatePipe } from '@angular/common';
import { InvoiceLayoutPage } from '../invoice-layout/invoice-layout.page';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-invoice-information',
  templateUrl: './invoice-information.page.html',
  styleUrls: ['./invoice-information.page.scss'],
})
export class InvoiceInformationPage implements OnInit {
  @ViewChild(InvoiceLayoutPage) child: InvoiceLayoutPage;
  invoice: Invoice;
  invoiceId: string;
  isLoading = false;
  private invoiceSub: Subscription;

  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private printer: Printer
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
          this.isLoading = false;
        });
    });
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

  generatePDF(action = 'open') {
    //image location
    const dateSendingToServer = new DatePipe('en-US').transform(
      this.invoice.invoiceDate,
      'dd/MM/yyyy'
    );
    console.log(dateSendingToServer);

    // pdfFonts.pdfMake.vfs['helvetica_b64']=helvetica
    // pdfFonts.pdfMake.vfs['helveticaBold_b64']=helveticaBold

    const docDefinition = {
      content: [
        {
          columns: [
            [
              {
                text: 'Reps: ' + this.invoice.responsible,
                bold: true,
                alignment: 'left',

                fontSize: 18,
              },
              {
                text: 'Reps: ' + this.invoice.responsible,
                bold: true,
                alignment: 'left',

                fontSize: 18,
              },
            ],
          ],
        },
      ],
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }

  printDiv(div){
    // const printContents = document.getElementById(div).innerHTML;
    //  const originalContents = document.body.innerHTML;
    //  document.body.innerHTML = printContents;
    //  window.print();
    //  document.body.innerHTML = originalContents;
  }

  printDiv1(div){
    this.child.printDiv(div);
  }
}
