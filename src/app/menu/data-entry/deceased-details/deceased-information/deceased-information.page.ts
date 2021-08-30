/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable object-shorthand */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Deceased } from '../deceased.model';
import { DeceasedService } from '../deceased.service';
import { jsPDF } from 'jspdf';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import domtoimage from 'dom-to-image';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { flexibleCompare } from '@fullcalendar/angular';
import {times} from  '../../../../../fonts/times-normal.Base64.encoded';
import {timesBold} from  '../../../../../fonts/times-bold.Base64.encoded';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-deceased-information',
  templateUrl: './deceased-information.page.html',
  styleUrls: ['./deceased-information.page.scss'],
})
export class DeceasedInformationPage implements OnInit {
  @ViewChild('pdfNotice', { static: false }) pdfNotice: ElementRef;

  deceased: Deceased;
  deceasedId: string;
  formType: string;
  isLoading = false;

  radioNoticePar3 = 'You are welcome to send a message of condolence to his/her family on the Foley and McGowan funeral home website www.sligofuneralhome.ie';
  radioNoticePar4 = 'Enquiries to The Foley and McGowan Funeral Home, Market Yard, Sligo 0719162140/info@sligofuneralhome.ie';
  private deceasedSub: Subscription;

  constructor(
    private deceasedService: DeceasedService,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private file: File,
    private fileOpener: FileOpener
  ) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('deceasedId')) {
        this.navCtrl.navigateBack('/menu/tabs/data-entry/deceased');
        return;
      }
      this.deceasedId = paramMap.get('deceasedId');
      this.formType = paramMap.get('formType');
      this.isLoading = true;
      this.deceasedSub = this.deceasedService
        .getDeceased(paramMap.get('deceasedId'))
        .subscribe((deceased) => {
          this.deceased = deceased;
          this.isLoading = false;

          // if(this.deceased.contact.responsible === undefined){
          //   this.deceased.contact.responsible = '';
          // }
        });
    });

  }

  onDeleteEntry(deceasedId: string) {
    this.actionSheetCtrl
      .create({
        header: 'Delete Entry?',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.loadingCtrl
                .create({ message: 'Deleting Entry...', duration: 5000 })
                .then((loadingEl) => {
                  loadingEl.present();
                  this.deceasedService
                    .cancelBooking(deceasedId)
                    .subscribe(() => {
                      loadingEl.dismiss();
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

  onEdit(deceasedId: string) {
    this.router.navigate([
      '/',
      'menu',
      'tabs',
      'data-entry',
      'deceased',
      'edit',
      deceasedId,
    ]);
    console.log('Editing item', deceasedId);
  }

  onTransfer(){
    let formType: string;
    // eslint-disable-next-line prefer-const
    formType = 'standard';
    this.loadingCtrl
      .create({
        message: 'Transferring Deceased Entry...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.deceasedService
          .transferDeceased(
            this.deceased.id,
            this.deceased.deceasedName,
            this.deceased.deathDate,
            this.deceased.age,
            this.deceased.dob,
            this.deceased.deathPlace,
            this.deceased.address1,
            this.deceased.address2,
            this.deceased.address3,
            this.deceased.county,
            this.deceased.contact,
            this.deceased.doctor,
            this.deceased.doctorNo,
            this.deceased.church,
            this.deceased.cemetry,
            this.deceased.grave,
            this.deceased.clergy,
            this.deceased.reposingAt,
            this.deceased.reposeDate,
            this.deceased.reposeTime,
            this.deceased.reposeEndTime,
            this.deceased.removalDate,
            this.deceased.removalTime,
            this.deceased.churchArrivalDate,
            this.deceased.churchArrivalTime,
            this.deceased.massDate,
            this.deceased.massTime,
            this.deceased.entryDate,
            formType,
            this.deceased.createdBy,
            this.deceased.noticePar1,
            this.deceased.noticePar2,
            this.deceased.specialRequests
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.router.navigate(['/menu/tabs/data-entry/deceased']);
          });
      });
  }

  viewPdf(action = 'open') {
    // const data = document.getElementById('pdfNotice');
    // // let data = document.getElementById("maindiv");
    // console.log(data);
    // html2canvas(data).then(canvas => {
    //   const contentDataURL = canvas.toDataURL('image/jpeg', 1.0);
    //   console.log(contentDataURL);
    //   const pdf = new jsPDF('p', 'cm', 'a4'); //Generates PDF in portrait mode
    //   pdf.addImage(contentDataURL, 'JPEG', 0, 0, 29.7, 21.0);
    //   pdf.save('Filename.pdf');
    // });

    pdfFonts.pdfMake.vfs['times_b64']=times;
    pdfFonts.pdfMake.vfs['timesBold_b64']=timesBold;
    // pdfFonts.pdfMake.vfs['helveticaBold_b64']=timesBold

    pdfMake.fonts = {
      courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique',
      },
      helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
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
            { style: 'column', font: 'Times', fontSize: 12, text: 'Send to news@oceanfm.ie' },
          ],
        },
        {
          columns: [
            {
              style: 'column',
              fontSize: 20,
              font: 'Times',
              bold: true,
              text: 'Foley & Mc Gowan’s Funeral Home',
            },
          ],
        },
        {
          columns: [
            {
              fontSize: 14,

              text: 'Old Market House,',
            },
          ],
        },
        {
          columns: [
            {
              fontSize: 14,

              text: 'Market Yard ,',
            },
          ],
        },
        {
          columns: [
            {
              fontSize: 14,
              style: 'column',
              text: 'Sligo',
            },
          ],
        },
        {
          columns: [
            {
              fontSize: 14,
              text: 'Tel : 071-9162140',
            },
          ],
        },
        {
          columns: [
            {
              fontSize: 14,
              text: 'Fax : 071-9143057',
            },
          ],
        },
        {
          columns: [
            {
              fontSize: 14,
              style: 'column',
              text: 'Email: sligofuneralhome@eircom.net',
            },
          ],
        },

        {
          columns: [
            {
              style: 'column',
              fontSize: 14,
              text: this.deceased.noticePar1,
            },
          ],
        },
        {
          columns: [
            {
              style: 'column',
              fontSize: 14,
              text: this.deceased.noticePar2,
            },
          ],
        },
        {
          columns: [
            {
              style: 'column',
              fontSize: 14,
              text: this.radioNoticePar3,
            },
          ],
        },
        {
          columns: [
            {
              fontSize: 14,
              alignment: 'center',
              text: this.radioNoticePar4,
            },
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        bigger: {
          fontSize: 15,
          italics: true,
        },
        column: {
          margin: [0, 0, 0, 30],
        },
      },
      defaultStyle: {
        font: 'Times'
      },
      pageMargins: [100, 70, 100, 70],
    };



    if (action === 'download') {
      pdfMake.createPdf(doc).download();
    } else if (action === 'print') {
      pdfMake.createPdf(doc).print();
    } else {
      pdfMake.createPdf(doc).open();
    }
  }

  viewPdfWeb(action = 'open') {
    const name = this.deceased.deceasedName.split(' ')[0];
    const currentRestrictions = `Due to current restrictions, ${name}’s funeral will be private to family, relatives and friends.`;
    // const data = document.getElementById('pdfNotice');
    // // let data = document.getElementById("maindiv");
    // console.log(data);
    // html2canvas(data).then(canvas => {
    //   const contentDataURL = canvas.toDataURL('image/jpeg', 1.0);
    //   console.log(contentDataURL);
    //   const pdf = new jsPDF('p', 'cm', 'a4'); //Generates PDF in portrait mode
    //   pdf.addImage(contentDataURL, 'JPEG', 0, 0, 29.7, 21.0);
    //   pdf.save('Filename.pdf');
    // });

    pdfFonts.pdfMake.vfs['times_b64']=times;
    pdfFonts.pdfMake.vfs['timesBold_b64']=timesBold;
    // pdfFonts.pdfMake.vfs['helveticaBold_b64']=timesBold

    pdfMake.fonts = {
      courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique',
      },
      helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
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
              style: 'column',
              fontSize: 14,
              text: this.deceased.noticePar1,
            },
          ],
        },
        {
          columns: [
            {
              style: 'column',
              fontSize: 14,
              text: 'Rest in Peace.',
            },
          ],
        },
        {
          columns: [
            {
              style: 'column',
              fontSize: 14,
              text: this.deceased.noticePar2,
            },
          ],
        },
        {
          columns: [
            {
              style: 'column',
              fontSize: 14,
              text: `You are welcome to stream ${name}’s funeral mass live by clicking ‘Live Stream’ below.`,
            },
          ],
        },
        {
          columns: [
            {
              fontSize: 14,
              style: 'column',
              text: currentRestrictions,
            },
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        bigger: {
          fontSize: 15,
          italics: true,
        },
        column: {
          margin: [0, 0, 0, 30],
        },
      },
      defaultStyle: {
        font: 'Times'
      },
      pageMargins: [100, 89, 100, 89],
    };



    if (action === 'download') {
      pdfMake.createPdf(doc).download();
    } else if (action === 'print') {
      pdfMake.createPdf(doc).print();
    } else {
      pdfMake.createPdf(doc).open();
    }
  }
}
