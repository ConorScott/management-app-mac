import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Debtor } from '../debtor.model';
import { DebtorService } from '../debtor.service';

@Component({
  selector: 'app-edit-debtor',
  templateUrl: './edit-debtor.page.html',
  styleUrls: ['./edit-debtor.page.scss'],
})
export class EditDebtorPage implements OnInit {
  debtor: Debtor;
  debtorId: string;
  title = 'Edit Debtor Information';
  form: FormGroup;
  isLoading = false;
  private debtorSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private debtorService: DebtorService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('debtorId')) {
        this.navCtrl.navigateBack('/menu/tabs/debtors');
        return;
      }
      this.debtorId = paramMap.get('debtorId');
      this.isLoading = true;
      this.debtorSub = this.debtorService
        .getDebtor(paramMap.get('debtorId'))
        .subscribe(
          (debtor) => {
            this.debtor = debtor;
            this.form = new FormGroup({
              deceasedName: new FormControl(this.debtor.deceasedName, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              responsible: new FormControl(this.debtor.responsible, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              invoiceDate: new FormControl(this.debtor.invoiceDate, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              servicesPrice: new FormControl(
                this.debtor.servicesPrice,
                {
                  updateOn: 'blur',
                }
              ),
              coffinDetails: new FormControl(this.debtor.coffinDetails, {
                updateOn: 'blur',
              }),
              coffinPrice: new FormControl(this.debtor.coffinPrice, {
                updateOn: 'blur',
              }),
              casketCoverPrice: new FormControl(this.debtor.casketCoverPrice, {
                updateOn: 'blur',
              }),
              coronerDoctorCertPrice: new FormControl(this.debtor.coronerDoctorCertPrice, {
                updateOn: 'blur',
              }),
              cremationPrice: new FormControl(this.debtor.cremationPrice, {
                updateOn: 'blur',
              }),
              urnPrice: new FormControl(this.debtor.urnPrice, {
                updateOn: 'blur',
              }),
              churchOfferringPrice: new FormControl(
                this.debtor.churchOfferringPrice,
                {
                  updateOn: 'blur',
                }
              ),
              sacristianPrice: new FormControl(this.debtor.sacristianPrice, {
                updateOn: 'blur',
              }),
              flowersPrice: new FormControl(this.debtor.flowersPrice, {
                updateOn: 'blur',
              }),
              graveOpenPrice: new FormControl(this.debtor.graveOpenPrice, {
                updateOn: 'blur',
              }),
              gravePurchasePrice: new FormControl(
                this.debtor.gravePurchasePrice,
                {
                  updateOn: 'blur',
                }
              ),
              graveMarkerPrice: new FormControl(this.debtor.graveMarkerPrice, {
                updateOn: 'blur',
              }),
              graveMatsTimbersPrice: new FormControl(
                this.debtor.graveMatsTimbersPrice,
                {
                  updateOn: 'blur',
                }
              ),
              clothsPrice: new FormControl(this.debtor.clothsPrice, {
                updateOn: 'blur',
              }),
              hairdresserPrice: new FormControl(this.debtor.hairdresserPrice, {
                updateOn: 'blur',
              }),
              radioNoticePrice: new FormControl(this.debtor.radioNoticePrice, {
                updateOn: 'blur',
              }),
              paperNoticePrice: new FormControl(this.debtor.paperNoticePrice, {
                updateOn: 'blur',
              }),
              organistPrice: new FormControl(this.debtor.organistPrice, {
                updateOn: 'blur',
              }),
              soloistPrice: new FormControl(this.debtor.soloistPrice, {
                updateOn: 'blur',
              }),
              otherDetailsPrice: new FormControl(
                this.debtor.otherDetailsPrice,
                {
                  updateOn: 'blur',
                }
              ),
              totalBalance: new FormControl(this.debtor.totalBalance, {
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
                  'Debtor information could not be fetched. Please try again later.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/menu/tabs/debtors']);
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

  updateDebtor() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating Debtor Account...'
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.debtorService
          .updateInvoiceDebtor(
            this.debtor.id,
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
          ).subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/menu/tabs/debtors']);
          });
      });
  }
}
