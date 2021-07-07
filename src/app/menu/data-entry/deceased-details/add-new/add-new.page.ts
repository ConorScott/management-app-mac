import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Cemetery } from '../../cemetery-list/cemetery.model';
import { CemeteryService } from '../../cemetery-list/cemetery.service';
import { Church } from '../../church-list/church.model';
import { ChurchService } from '../../church-list/church.service';
import { DeceasedService } from '../deceased.service';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.page.html',
  styleUrls: ['./add-new.page.scss'],
})
export class AddNewPage implements OnInit {
  form: FormGroup;
  createdAt = new Date();
  cemetery: Cemetery[];
  church: Church[];
  listType = 'standard';
  private churchSub: Subscription;
  private cemeterySub: Subscription;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private deceasedService: DeceasedService,
    private cemeteryService: CemeteryService,
    private churchService: ChurchService
  ) {}

  ngOnInit() {
    this.cemeterySub = this.cemeteryService.cemetery.subscribe((cemetery) => {
      this.cemetery = cemetery;
    });

    this.churchSub = this.churchService.church.subscribe((church) => {
      this.church = church;
    });

    this.form = new FormGroup({
      deceasedName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      deathDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      age: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dob: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      deathPlace: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      address1: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      address2: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      address3: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      county: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      contact: new FormGroup({
        responsible: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        relationship: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        phoneNo: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        resAddress1: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        resAddress2: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        resAddress3: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        resCounty: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        responsible2: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        relationship2: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        phoneNo2: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        resAddress12: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        resAddress22: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        resAddress32: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        resCounty2: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
      }),
      doctor: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      doctorNo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      church: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      cemetery: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      grave: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      clergy: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
     reposeDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
     reposeTime: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      removalTime: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      churchArrivalTime: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      massDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      massTime: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      formType: new FormControl(this.listType, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }

  ionViewWillEnter() {
    this.cemeteryService.fetchCemeterys().subscribe(() => {});

    this.churchService.fetchChurches().subscribe(() => {});
  }

  onCreateEntry() {
    this.loadingCtrl
      .create({
        message: 'Creating Entry',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.deceasedService
          .addDeceased(
            this.form.value.deceasedName,
            this.form.value.deathDate,
            this.form.value.age,
            this.form.value.dob,
            this.form.value.deathPlace,
            this.form.value.address1,
            this.form.value.address2,
            this.form.value.address3,
            this.form.value.county,
            this.form.value.contact,
            this.form.value.doctor,
            this.form.value.doctorNo,
            this.form.value.church,
            this.form.value.cemetery,
            this.form.value.grave,
            this.form.value.clergy,
            this.form.value.reposeDate,
            this.form.value.reposeTime,
            this.form.value.removalTime,
            this.form.value.churchArrivalTime,
            this.form.value.massDate,
            this.form.value.massTime,
            this.createdAt,
            this.form.value.formType
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/menu/tabs/data-entry/deceased']);
          });
      });
  }

  listTypeChange(event){
   this.listType = event.target.value;
   console.log(this.listType);
  }
}