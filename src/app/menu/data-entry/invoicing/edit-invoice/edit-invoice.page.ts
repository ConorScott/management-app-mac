import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DebtorService } from 'src/app/menu/debtors/debtor.service';
import { Invoice } from '../invoice.model';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.page.html',
  styleUrls: ['./edit-invoice.page.scss'],
})
export class EditInvoicePage implements OnInit {
  invoice: Invoice;
  invoiceId: string;
  form: FormGroup;
  isLoading = false;
  private invoiceSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private debtorService: DebtorService
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
        .subscribe(
          (invoice) => {
            this.invoice = invoice;
            this.form = new FormGroup({
              deceasedName: new FormControl(this.invoice.deceasedName, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              responsible: new FormControl(this.invoice.responsible, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              invoiceDate: new FormControl(this.invoice.invoiceDate, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              services: new FormControl(this.invoice.services, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              servicesPrice: new FormControl(this.invoice.servicesPrice, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              coffinDetails: new FormControl(this.invoice.coffinDetails, {
                updateOn: 'blur',
              }),
              coffinPrice: new FormControl(this.invoice.coffinPrice, {
                updateOn: 'blur',
              }),
              casketCover: new FormControl(this.invoice.casketCover, {
                updateOn: 'blur',
              }),
              casketCoverPrice: new FormControl(this.invoice.casketCoverPrice, {
                updateOn: 'blur',
              }),
              coronerDoctorCert: new FormControl(
                this.invoice.coronerDoctorCert,
                {
                  updateOn: 'blur',
                }
              ),
              coronerDoctorCertPrice: new FormControl(
                this.invoice.coronerDoctorCertPrice,
                {
                  updateOn: 'blur',
                }
              ),
              cremation: new FormControl(this.invoice.cremation, {
                updateOn: 'blur',
              }),
              cremationPrice: new FormControl(this.invoice.cremationPrice, {
                updateOn: 'blur',
              }),
              urn: new FormControl(this.invoice.urn, {
                updateOn: 'blur',
              }),
              urnPrice: new FormControl(this.invoice.urnPrice, {
                updateOn: 'blur',
              }),
              churchOfferring: new FormControl(this.invoice.churchOfferring, {
                updateOn: 'blur',
              }),
              churchOfferringPrice: new FormControl(
                this.invoice.churchOfferringPrice,
                {
                  updateOn: 'blur',
                }
              ),
              sacristian: new FormControl(this.invoice.sacristian, {
                updateOn: 'blur',
              }),
              sacristianPrice: new FormControl(this.invoice.sacristianPrice, {
                updateOn: 'blur',
              }),
              flowers: new FormControl(this.invoice.flowers, {
                updateOn: 'blur',
              }),
              flowersPrice: new FormControl(this.invoice.flowersPrice, {
                updateOn: 'blur',
              }),
              graveOpen: new FormControl(this.invoice.graveOpen, {
                updateOn: 'blur',
              }),
              graveOpenPrice: new FormControl(this.invoice.graveOpenPrice, {
                updateOn: 'blur',
              }),
              gravePurchaseToCouncil: new FormControl(
                this.invoice.gravePurchaseToCouncil,
                {
                  updateOn: 'blur',
                }
              ),
              gravePurchasePrice: new FormControl(
                this.invoice.gravePurchasePrice,
                {
                  updateOn: 'blur',
                }
              ),
              graveMarker: new FormControl(this.invoice.graveMarker, {
                updateOn: 'blur',
              }),
              graveMarkerPrice: new FormControl(this.invoice.graveMarkerPrice, {
                updateOn: 'blur',
              }),
              graveMatsTimbers: new FormControl(this.invoice.graveMatsTimbers, {
                updateOn: 'blur',
              }),
              graveMatsTimbersPrice: new FormControl(
                this.invoice.graveMatsTimbersPrice,
                {
                  updateOn: 'blur',
                }
              ),
              cloths: new FormControl(this.invoice.cloths, {
                updateOn: 'blur',
              }),
              clothsPrice: new FormControl(this.invoice.clothsPrice, {
                updateOn: 'blur',
              }),
              hairdresser: new FormControl(this.invoice.hairdresser, {
                updateOn: 'blur',
              }),
              hairdresserPrice: new FormControl(this.invoice.hairdresserPrice, {
                updateOn: 'blur',
              }),
              radioDeathNotices: new FormControl(
                this.invoice.radioDeathNotices,
                {
                  updateOn: 'blur',
                }
              ),
              radioNoticePrice: new FormControl(this.invoice.radioNoticePrice, {
                updateOn: 'blur',
              }),
              paperDeathNotices: new FormControl(
                this.invoice.paperDeathNotices,
                {
                  updateOn: 'blur',
                }
              ),
              paperNoticePrice: new FormControl(this.invoice.paperNoticePrice, {
                updateOn: 'blur',
              }),
              organist: new FormControl(this.invoice.organist, {
                updateOn: 'blur',
              }),
              organistPrice: new FormControl(this.invoice.organistPrice, {
                updateOn: 'blur',
              }),
              soloist: new FormControl(this.invoice.soloist, {
                updateOn: 'blur',
              }),
              soloistPrice: new FormControl(this.invoice.soloistPrice, {
                updateOn: 'blur',
              }),
              otherDetails: new FormControl(this.invoice.otherDetails, {
                updateOn: 'blur',
              }),
              otherDetailsPrice: new FormControl(
                this.invoice.otherDetailsPrice,
                {
                  updateOn: 'blur',
                }
              ),
              totalBalance: new FormControl(this.invoice.totalBalance, {
                updateOn: 'blur',
              }),
            });
            this.isLoading = false;
          },
          (error) => {
            this.alertCtrl
              .create({
                header: 'An error occurred!',
                message:
                  'Deceased information could not be fetched. Please try again later.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/menu/tabs/data-entry/deceased']);
                    },
                  },
                ],
              })
              .then((alertEl) => {
                alertEl.present();
              });
          }
        );
    });
  }
  onUpdateInvoice() {
    this.onUpdateDebtor();
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating Invoice Information...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.invoiceService
          .updateInvoice(
            this.invoice.id,
            this.form.value.deceasedName,
            this.form.value.responsible,
            this.form.value.invoiceDate,
            this.form.value.services,
            this.form.value.servicesPrice,
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
            this.form.value.otherDetailsPrice
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/menu/tabs/data-entry/invoicing']);
          });
      });
  }
  onUpdateDebtor() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating Invoice Information...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.debtorService
          .updateInvoiceDebtor(
            this.invoice.id,
            this.form.value.deceasedName,
            this.form.value.responsible,
            this.form.value.invoiceDate,
            this.form.value.servicesPrice,
            this.form.value.coffinDetails,
            this.form.value.coffinPrice,
            this.form.value.casketCoverPrice,
            this.form.value.coronerDoctorCertPrice,
            this.form.value.cremationPrice,
            this.form.value.urnPrice,
            this.form.value.churchOfferringPrice,
            this.form.value.sacristianPrice,
            this.form.value.flowersPrice,
            this.form.value.graveOpenPrice,
            this.form.value.gravePurchasePrice,
            this.form.value.graveMarkerPrice,
            this.form.value.graveMatsTimbersPrice,
            this.form.value.clothsPrice,
            this.form.value.hairdresserPrice,
            this.form.value.radioNoticePrice,
            this.form.value.paperNoticePrice,
            this.form.value.organistPrice,
            this.form.value.soloistPrice,
            this.form.value.otherDetailsPrice,
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/menu/tabs/data-entry/invoicing']);
          });
      });
  }
}
