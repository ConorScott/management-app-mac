/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { InvoiceService } from '../invoice.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatePipe } from '@angular/common';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DeceasedService } from '../../deceased-details/deceased.service';
import { Observable, Subscription } from 'rxjs';
import { Deceased } from '../../deceased-details/deceased.model';
import { Payment } from 'src/app/shared/payment.model';
import { Coffin } from 'src/app/menu/coffin-stock/coffin.model';
import { CoffinService } from 'src/app/menu/coffin-stock/coffin.service';
import { count, map, switchMap, tap } from 'rxjs/operators';
import { CoffinSalesService } from 'src/app/menu/reports/coffin-sales/coffin-sales.service';
import { UserService } from 'src/app/menu/users/user.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.page.html',
  styleUrls: ['./create-invoice.page.scss'],
})
export class CreateInvoicePage implements OnInit, OnDestroy {
  isLoading = false;
  deceased: Deceased[];
  deceasedName: string;
  responsible: string;
  coffinId: string;
  servicesEntry =
    // eslint-disable-next-line max-len
    'Ambulance to transfer to Mcgowans Funeral home Ballina. Hearse and two men for removal from Funeral home to Church. Hearse and two men for Funeral to Cemetery. Embalming and hygienic treatment carried out. Dressing and preparation of Deceased for viewing. Arrangement and supervision of all the details in the care, planning and arranging of the Funeral. Liaising with the Clergy and arranging with the radio, Press and cemetery. Full access to all the Funeral Home facilities and services therein.';

  deceasedId: string;
  deathDate: string;
  address1: string;
  address2: string;
  address3: string;
  county: string;
  coffin: Coffin[];
  userName: string;
  payments: Payment;
  formType = 'standard';
  form: FormGroup;

  selected_port = null;
  isMobile = false;
  private deceasedSub: Subscription;
  private coffinSub: Subscription;
  private deceasedAddressSub: Subscription;

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private deceasedService: DeceasedService,
    private coffinService: CoffinService,
    private coffinSaleService: CoffinSalesService,
    private userService: UserService
  ) {}

  ngOnInit() {
    if(window.screen.width < 576)
    {
      this.isMobile = true;
    }
    this.userService.getUserName().subscribe(user => {
      console.log(user);
      user.map(createdBy => {
        this.userName = createdBy.name;
      });
    });
    this.coffinSub = this.coffinService.coffin.subscribe((coffin) => {
      this.coffin = coffin;
      this.coffin.map((coffins) => {
        if (coffins.stockLocation === 'sligo') {
          coffins.coffinName = coffins.coffinName + ' (Sligo)';
        } else if (coffins.stockLocation === 'ballina') {
          coffins.coffinName = coffins.coffinName + ' (Ballina)';
        }
      });
    });
    this.deceasedSub = this.deceasedService.deceased.subscribe((deceased) => {
      this.deceased = deceased;
      this.deceased.map((res) => {
        this.deceasedName = res.deceasedName;
        this.deceasedId = res.id;
        this.deathDate = res.deathDate;
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
      services: new FormControl(this.servicesEntry, {
        updateOn: 'blur',
      }),
      servicesPrice: new FormControl(null, {
        updateOn: 'blur',
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
    this.coffinService.fetchAllCoffins().subscribe(() => {});
  }

  onGenerateInvoice() {
   const stockLocation = this.onCoffinStock(this.form.value.coffinDetails);
   console.log(stockLocation);

    this.onCoffinSale(
      this.form.value.invoiceDate,
      this.form.value.coffinDetails,
      this.form.value.coffinPrice,
      this.form.value.deceasedName.deceasedName
    );
    const totalBalance =
      this.form.value.servicesPrice +
      this.form.value.coffinPrice +
      this.form.value.casketCoverPrice +
      this.form.value.coronerDoctorCertPrice +
      this.form.value.cremationPrice +
      this.form.value.urnPrice +
      this.form.value.churchOfferringPrice +
      this.form.value.sacristianPrice +
      this.form.value.flowersPrice +
      this.form.value.graveOpenPrice +
      this.form.value.gravePurchasePrice +
      this.form.value.graveMarkerPrice +
      this.form.value.graveMatsTimbersPrice +
      this.form.value.clothsPrice +
      this.form.value.hairdresserPrice +
      this.form.value.radioNoticePrice +
      this.form.value.paperNoticePrice +
      this.form.value.organistPrice +
      this.form.value.soloistPrice +
      this.form.value.otherDetailsPrice;
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
            this.form.value.services,
            this.form.value.servicesPrice,
            this.form.value.coffinDetails,
            this.form.value.coffinPrice,
            stockLocation,
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
            totalBalance,
            this.address1,
            this.address2,
            this.address3,
            this.county,
            this.userName,
            this.deathDate
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/menu/tabs/data-entry/invoicing']);
          });
      });
  }

  onCoffinSale(
    coffinSaleDate: Date,
    coffinName: string,
    amount: number,
    deceasedName: string
  ) {
    let stockLocation: string;
    const name = coffinName.split(' (')[0];
    const location = coffinName.split('(')[1];

    if (location === 'Sligo)') {
      stockLocation = 'Sligo';
    } else if (location === 'Ballina)') {
      stockLocation = 'Ballina';
    }
    this.coffinSaleService
      .addCoffinSale(coffinSaleDate, name, stockLocation, amount, deceasedName)
      .subscribe();
  }

  onCoffinStock(name: string) {
    let stockLocation: string;
    let coffinId: string;
    const coffinName = name.split(' (')[0];
    const location = name.split('(')[1];

    if (location === 'Sligo)') {
      stockLocation = 'sligo';
    } else if (location === 'Ballina)') {
      stockLocation = 'ballina';
    }
     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.coffinService
      .getCoffinId(coffinName, stockLocation)
      .subscribe((coffins) => {
        console.log(coffins);
        coffins.map((id) => {
           coffinId = id.id;
          this.coffinService
            .updateCoffins(id.id, coffinName, id.stockLevel, id.stockLocation)
            .subscribe();
        });

      });

      return stockLocation;

    //  return this.coffinService.getCoffinId(coffinName, stockLocation).pipe(
    //    switchMap(id => {
    //       return id;
    //    }),map(id => {
    //     return this.coffinService
    //     .updateCoffins(id.id, coffinName, id.stockLevel);
    //    })
    //  );
      // .pipe(switchMap(id =>
      //   this.coffinService.updateCoffins(id.id, coffinName, id.stockLevel)
      //    ));

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

  ngOnDestroy() {
    this.deceasedSub.unsubscribe();
    this.coffinSub.unsubscribe();
    // this.deceasedAddressSub.unsubscribe();
  }
}
