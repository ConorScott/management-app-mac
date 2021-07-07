/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { InvoiceService } from '../invoice.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatePipe } from '@angular/common';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DeceasedService } from '../../deceased-details/deceased.service';
import { Subscription } from 'rxjs';
import { Deceased } from '../../deceased-details/deceased.model';
import { Payment } from 'src/app/shared/payment.model';
import { Coffin } from 'src/app/menu/coffin-stock/coffin.model';
import { CoffinService } from 'src/app/menu/coffin-stock/coffin.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.page.html',
  styleUrls: ['./create-invoice.page.scss'],
})
export class CreateInvoicePage implements OnInit {
  isLoading = false;
  deceased: Deceased[];
  deceasedName: string;
  responsible: string;
  deceasedId: string;
  coffin: Coffin[];
  payments: Payment;
  formType = 'standard';
  form: FormGroup;

  selected_port = null;
  private deceasedSub: Subscription;
  private coffinSub: Subscription;

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private deceasedService: DeceasedService,
    private coffinService: CoffinService
  ) {}

  ngOnInit() {
    this.coffinSub = this. coffinService.coffin.subscribe((coffin) => {
    this.coffin = coffin;
    });
    this.deceasedSub = this.deceasedService.deceased.subscribe((deceased) => {
      this.deceased = deceased;
      this.deceased.map((res) => {
        this.deceasedName = res.deceasedName;
        this.deceasedId = res.id;
      });
    });

    this.form = new FormGroup({
      id: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      deceasedName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      responsible: new FormControl(this.responsible, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      invoiceDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      services: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      servicesPrice: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      coffinDetails: new FormControl(null, {
        updateOn: 'blur',
      }),
      coffinPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      casketCover: new FormControl(null, {
        updateOn: 'blur',
      }),
      casketCoverPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      coronerDoctorCert: new FormControl(null, {
        updateOn: 'blur',
      }),
      coronerDoctorCertPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      cremation: new FormControl(null, {
        updateOn: 'blur',
      }),
      cremationPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      urn: new FormControl(null, {
        updateOn: 'blur',
      }),
      urnPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      churchOfferring: new FormControl(null, {
        updateOn: 'blur',
      }),
      churchOfferringPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      sacristian: new FormControl(null, {
        updateOn: 'blur',
      }),
      sacristianPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      flowers: new FormControl(null, {
        updateOn: 'blur',
      }),
      flowersPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      graveOpen: new FormControl(null, {
        updateOn: 'blur',
      }),
      graveOpenPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      gravePurchaseToCouncil: new FormControl(null, {
        updateOn: 'blur',
      }),
      gravePurchasePrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      graveMarker: new FormControl(null, {
        updateOn: 'blur',
      }),
      graveMarkerPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      graveMatsTimbers: new FormControl(null, {
        updateOn: 'blur',
      }),
      graveMatsTimbersPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      cloths: new FormControl(null, {
        updateOn: 'blur',
      }),
      clothsPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      hairdresser: new FormControl(null, {
        updateOn: 'blur',
      }),
      hairdresserPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      radioDeathNotices: new FormControl(null, {
        updateOn: 'blur',
      }),
      radioNoticePrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      paperDeathNotices: new FormControl(null, {
        updateOn: 'blur',
      }),
      paperNoticePrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      organist: new FormControl(null, {
        updateOn: 'blur',
      }),
      organistPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      soloist: new FormControl(null, {
        updateOn: 'blur',
      }),
      soloistPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      otherDetails: new FormControl(null, {
        updateOn: 'blur',
      }),
      otherDetailsPrice: new FormControl(null, {
        updateOn: 'blur',
      }),
      formType: new FormControl(this.formType, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
    this.isLoading = false;
  }

  ionViewWillEnter() {
    this.deceasedService.fetchDeceasedInvoice().subscribe(() => {
      this.isLoading = false;
    });
    this.coffinService.fetchCoffins().subscribe(() => {});
  }

  onGenerateInvoice() {
    this.loadingCtrl
      .create({
        message: 'Creating invoice...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.invoiceService
          .addInvoice(
            this.form.value.deceasedName.deceasedName,
            this.form.value.responsible,
            this.form.value.invoiceDate,
            this.form.value.defaultEntry,
            this.form.value.defaultEntryPrice,
            this.form.value.coffinDetails,
            this.form.value.coffinPrice,
            this.form.value.casketCover,
            this.form.value.casketCoverPrice,
            this.form.value.coronerDoctorCert,
            this.form.value.coronerDoctorCertPrice,
            this.form.value.cremation,
            this.form.value.cremationPrice,
            this.form.value.urn,
            this.form.value.urnPrice,
            this.form.value.churchOfferring,
            this.form.value.churchOfferringPrice,
            this.form.value.sacristian,
            this.form.value.sacristianPrice,
            this.form.value.flowers,
            this.form.value.flowersPrice,
            this.form.value.graveOpen,
            this.form.value.graveOpenPrice,
            this.form.value.gravePurchaseToCouncil,
            this.form.value.gravePurchasePrice,
            this.form.value.graveMarker,
            this.form.value.graveMarkerPrice,
            this.form.value.graveMatsTimbers,
            this.form.value.graveMatsTimbersPrice,
            this.form.value.cloths,
            this.form.value.clothsPrice,
            this.form.value.hairdresser,
            this.form.value.hairdresserPrice,
            this.form.value.radioDeathNotices,
            this.form.value.radioNoticePrice,
            this.form.value.paperDeathNotices,
            this.form.value.paperNoticePrice,
            this.form.value.organist,
            this.form.value.organistPrice,
            this.form.value.soloist,
            this.form.value.soloistPrice,
            this.form.value.otherDetails,
            this.form.value.otherDetailsPrice,
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/menu/tabs/data-entry/invoicing']);
          });
      });
  }

  printPage() {
    window.print();
  }
  portChange(event: { component: IonicSelectableComponent; value: any }) {
    this.form.value.firstName = event.value.deceasedName;
    this.deceasedService.getDeceased(event.value.id).subscribe((deceased) => {
      this.responsible = deceased.contact.responsible;
      return this.responsible;
    });
  }
  listTypeChange(event) {
    this.deceasedService.getDeceased(this.deceasedId).subscribe((deceased) => {
      this.deceased = [{ ...deceased }];
      this.responsible = deceased.contact.responsible;
      return this.responsible;
    });
  }
}
