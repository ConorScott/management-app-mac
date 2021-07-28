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
import { DatePipe } from '@angular/common';
import { InvoiceLayoutPage } from '../invoice-layout/invoice-layout.page';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { DeceasedService } from '../../deceased-details/deceased.service';
import { CoffinService } from 'src/app/menu/coffin-stock/coffin.service';

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
  isLoading = false;
  private invoiceSub: Subscription;

  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private deceasedService: DeceasedService,
    private printer: Printer,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private coffinService: CoffinService
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
          this.deceasedService
            .fetchDeceasedAddress(
              this.invoice.deceasedName,
              this.invoice.responsible
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
  }

  printDiv1(div) {
    this.child.printDiv(div);
  }
}
