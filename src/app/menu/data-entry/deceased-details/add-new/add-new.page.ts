/* eslint-disable @typescript-eslint/quotes */
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { CalendarService } from 'src/app/menu/calendar/calendar.service';
import { CashbookService } from 'src/app/menu/reports/cashbook/cashbook.service';
import { TipsService } from 'src/app/menu/reports/tips/tips.service';
import { UserService } from 'src/app/menu/users/user.service';
import { Cemetery } from '../../cemetery-list/cemetery.model';
import { CemeteryService } from '../../cemetery-list/cemetery.service';
import { Church } from '../../church-list/church.model';
import { ChurchService } from '../../church-list/church.service';
import { DeceasedService } from '../deceased.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#32a852'
  },
  lightRed: {
    primary: '#f20a0a'
  }
};

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.page.html',
  styleUrls: ['./add-new.page.scss'],
})
export class AddNewPage implements OnInit {
  form: FormGroup;
  horizon: FormGroup;
  createdAt = new Date();
  cemetery: Cemetery[];
  church: Church[];
  listType = 'standard';
  formType;

  userId: string;
  userName: string;
  sacristanSligo: string;
  noticeString: string;
  noticeRemovalDate: string;
  noticeReposeStart: string;
  noticeReposeEnd: string;
  modalHeader: any = {
    header: 'Form Type',
  };
  // eslint-disable-next-line max-len
  deathNotice = `Reposing at (Place) from (Repose Start Time) to (Repose End Time). Funeral will leave(Place) to arrive at (Church) for Requiem mass at (Mass Start Time). Funeral will proceed to (Cemetery). Due to current restrictions, (Person) funeral will be private to family, relatives and friends. House private please (optional) Family flowers only. Donations in lieu of flowers if desired to (Charity) care of McGowan's funeral home, Emmet St, Ballina, Co. Mayo (or Foley & McGowan's Funeral Home, Market Yard, Sligo)You are welcome to send a message of condolence to his/her family on the funeral home website.`;
  private churchSub: Subscription;
  private cemeterySub: Subscription;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private deceasedService: DeceasedService,
    private cemeteryService: CemeteryService,
    private churchService: ChurchService,
    private tipService: TipsService,
    private authService: AuthService,
    private userService: UserService,
    private alertCtrl: AlertController,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {

    this.cemeterySub = this.cemeteryService.cemetery.subscribe((cemetery) => {
      this.cemetery = cemetery;
    });

    this.churchSub = this.churchService.church.subscribe((church) => {
      this.church = church;
    });

    this.userService.getUserName().subscribe(user => {
      console.log(user);
      user.map(createdBy => {
        this.userName = createdBy.name;
      });
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

        }),
        relationship: new FormControl(null, {
          updateOn: 'blur',

        }),
        phoneNo: new FormControl(null, {
          updateOn: 'blur',

        }),
        resAddress1: new FormControl(null, {
          updateOn: 'blur',

        }),
        resAddress2: new FormControl(null, {
          updateOn: 'blur',

        }),
        resAddress3: new FormControl(null, {
          updateOn: 'blur',

        }),
        resCounty: new FormControl(null, {
          updateOn: 'blur',

        }),
        responsible2: new FormControl(null, {
          updateOn: 'blur',

        }),
        relationship2: new FormControl(null, {
          updateOn: 'blur',

        }),
        phoneNo2: new FormControl(null, {
          updateOn: 'blur',

        }),
        resAddress12: new FormControl(null, {
          updateOn: 'blur',

        }),
        resAddress22: new FormControl(null, {
          updateOn: 'blur',

        }),
        resAddress32: new FormControl(null, {
          updateOn: 'blur',

        }),
        resCounty2: new FormControl(null, {
          updateOn: 'blur',

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
      reposingAt: new FormControl(null, {
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
      reposeEndTime: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      removalDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      removalTime: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      churchArrivalDate: new FormControl(null, {
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
      noticePar1: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      noticePar2: new FormControl(this.deathNotice, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      specialRequests: new FormControl(null, {
        updateOn: 'blur',
      }),
    });
  }

  ionViewWillEnter() {
    this.cemeteryService.fetchCemeterys().subscribe(() => {});

    this.churchService.fetchChurches().subscribe(() => {});
  }
  reposingAtNotice(event){
    let nameDeceased: string;
    nameDeceased = this.form.value.deceasedName;
    nameDeceased = nameDeceased.split(' ')[0];
    const reposingAt = event.target.value;
    const massTime = this.datePipe.transform(this.form.value.massTime, 'h:mm a');
    // eslint-disable-next-line max-len
    this.form.controls.noticePar2.setValue(`Reposing at ${reposingAt} from ${this.noticeReposeStart} to ${this.noticeReposeEnd}. Funeral will leave ${reposingAt} to arrive at ${this.form.value.church} for Requiem mass at ${massTime}. Funeral will proceed to ${this.form.value.cemetery}. Due to current restrictions, ${nameDeceased}'s funeral will be private to family, relatives and friends. House private please (optional) Family flowers only. Donations in lieu of flowers if desired to (Charity) care of McGowan's funeral home, Emmet St, Ballina, Co. Mayo (or Foley & McGowan's Funeral Home, Market Yard, Sligo)You are welcome to send a message of condolence to his/her family on the funeral home website.`);
  }

  reposeStartTimeNotice(event){
    if(event.detail.value !== "")
    {
      let nameDeceased: string;
      nameDeceased = this.form.value.deceasedName;
      nameDeceased = nameDeceased.split(' ')[0];
      this.noticeReposeStart = event.target.value;
      this.noticeReposeStart = this.datePipe.transform(this.noticeReposeStart, 'h:mm a');
      const massTime = this.datePipe.transform(this.form.value.massTime, 'h:mm a');
      // eslint-disable-next-line max-len
      this.form.controls.noticePar2.setValue(`Reposing at ${this.form.value.reposingAt} from ${this.noticeReposeStart} to ${this.noticeReposeEnd}. Funeral will leave ${this.form.value.reposingAt} to arrive at ${this.form.value.church} for Requiem mass at ${massTime}. Funeral will proceed to ${this.form.value.cemetery}. Due to current restrictions, ${nameDeceased}'s funeral will be private to family, relatives and friends. House private please (optional) Family flowers only. Donations in lieu of flowers if desired to (Charity) care of McGowan's funeral home, Emmet St, Ballina, Co. Mayo (or Foley & McGowan's Funeral Home, Market Yard, Sligo)You are welcome to send a message of condolence to his/her family on the funeral home website.`);
    }
  }

  reposeEndTimeNotice(event){
    if(event.detail.value !== ""){
      let nameDeceased: string;
      nameDeceased = this.form.value.deceasedName;
      nameDeceased = nameDeceased.split(' ')[0];
      this.noticeReposeEnd = event.target.value;
      this.noticeReposeEnd = this.datePipe.transform(this.noticeReposeEnd, 'h:mm a');
      const massTime = this.datePipe.transform(this.form.value.massTime, 'h:mm a');
      // eslint-disable-next-line max-len
      this.form.controls.noticePar2.setValue(`Reposing at ${this.form.value.reposingAt} from ${this.noticeReposeStart} to ${this.noticeReposeEnd}. Funeral will leave ${this.form.value.reposingAt} to arrive at ${this.form.value.church} for Requiem mass at ${massTime}. Funeral will proceed to ${this.form.value.cemetery}. Due to current restrictions, ${nameDeceased}'s funeral will be private to family, relatives and friends. House private please (optional) Family flowers only. Donations in lieu of flowers if desired to (Charity) care of McGowan's funeral home, Emmet St, Ballina, Co. Mayo (or Foley & McGowan's Funeral Home, Market Yard, Sligo)You are welcome to send a message of condolence to his/her family on the funeral home website.`);
    }


  }

  massTimeNotice(event){
    if(event.detail.value !== ""){
      let nameDeceased: string;
      nameDeceased = this.form.value.deceasedName;
      nameDeceased = nameDeceased.split(' ')[0];
      let masstime = event.target.value;
      masstime = this.datePipe.transform(masstime, 'h:mm a');
      // eslint-disable-next-line max-len
      this.form.controls.noticePar2.setValue(`Reposing at ${this.form.value.reposingAt} from ${this.noticeReposeStart} to ${this.noticeReposeEnd}. Funeral will leave ${this.form.value.reposingAt} to arrive at ${this.form.value.church} for Requiem mass at ${masstime}. Funeral will proceed to ${this.form.value.cemetery}. Due to current restrictions, ${nameDeceased}'s funeral will be private to family, relatives and friends. House private please (optional) Family flowers only. Donations in lieu of flowers if desired to (Charity) care of McGowan's funeral home, Emmet St, Ballina, Co. Mayo (or Foley & McGowan's Funeral Home, Market Yard, Sligo)You are welcome to send a message of condolence to his/her family on the funeral home website.`);
    }


  }

  onCreateEntry() {
    // this.reposeDate();
    console.log(this.sacristanSligo);
    console.log(this.form.value.church);
    if(this.form.value.cemetery === 'Sligo Cemetery'){
      this.tipService.addGraveDiggerPaymentBrian(this.createdAt, this.form.value.deceasedName, this.form.value.cemetery).subscribe();
      this.tipService.addGraveDiggerPaymentTerry(this.createdAt, this.form.value.deceasedName, this.form.value.cemetery).subscribe();

    }
    if(this.form.value.church === 'The Cathedral of The Immaculate Conception, Sligo'){
      console.log('success');
      console.log(this.sacristanSligo);
      this.tipService.addSligoCathedralPayment(this.createdAt, this.sacristanSligo, this.form.value.deceasedName).subscribe();
    }
    if(this.form.value.church === 'St. Anne’s Church Sligo'){
      this.tipService.addSacristanPayment(this.createdAt).subscribe();
    }

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
            this.form.value.reposingAt,
            this.form.value.reposeDate,
            this.form.value.reposeTime,
            this.form.value.reposeEndTime,
            this.form.value.removalDate,
            this.form.value.removalTime,
            this.form.value.churchArrivalDate,
            this.form.value.churchArrivalTime,
            this.form.value.massDate,
            this.form.value.massTime,
            this.createdAt,
            this.form.value.formType,
            this.userName,
            this.form.value.noticePar1,
            this.form.value.noticePar2,
            this.form.value.specialRequests
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/menu/tabs/data-entry/deceased']);
          });
      });
  }

  async churchSelect(event){
  console.log(event.detail.value);
  if(event.detail.value === 'The Cathedral of The Immaculate Conception, Sligo'){
    const alert = await this.alertCtrl.create({
      header: 'Select Sacristan',
      inputs: [
        {
          type: 'radio',
          label: 'Ray Murtagh',
          value: 'Ray Murtagh',
        },
        {
          type: 'radio',
          label: 'Kieran Maughan',
          value: 'Kieran Maughan',
        }
      ],
      buttons: [
        {
          text: 'Submit',
          handler: (data: any) => {
            this.sacristanSligo = data;
            console.log(this.sacristanSligo);
          }
        }
      ]
    });
    await alert.present();

  }
  }

  listTypeChange(event) {
    this.listType = event.target.value;
    console.log(this.listType);
    if(this.listType === 'horizon'){
      this.form.get('deceasedName').clearValidators();
      this.form.get('deceasedName').updateValueAndValidity();
      this.form.get('deathDate').clearValidators();
      this.form.get('deathDate').updateValueAndValidity();
      this.form.get('age').clearValidators();
      this.form.get('age').updateValueAndValidity();
      this.form.get('dob').clearValidators();
      this.form.get('dob').updateValueAndValidity();
      this.form.get('deathPlace').clearValidators();
      this.form.get('deathPlace').updateValueAndValidity();
      this.form.get('address1').clearValidators();
      this.form.get('address1').updateValueAndValidity();
      this.form.get('address2').clearValidators();
      this.form.get('address2').updateValueAndValidity();
      this.form.get('address3').clearValidators();
      this.form.get('address3').updateValueAndValidity();
      this.form.get('county').clearValidators();
      this.form.get('county').updateValueAndValidity();
      this.form.get('contact').clearValidators();
      this.form.get('contact').updateValueAndValidity();
      // this.form.get('responsible').clearValidators();
      // this.form.get('responsible').updateValueAndValidity();
      // this.form.get('relationship').clearValidators();
      // this.form.get('relationship').updateValueAndValidity();
      // this.form.get('phoneNo').clearValidators();
      // this.form.get('phoneNo').updateValueAndValidity();
      // this.form.get('resAddress1').clearValidators();
      // this.form.get('resAddress1').updateValueAndValidity();
      // this.form.get('resAddress2').clearValidators();
      // this.form.get('resAddress2').updateValueAndValidity();
      // this.form.get('resAddress3').clearValidators();
      // this.form.get('resAddress3').updateValueAndValidity();
      // this.form.get('resCounty').clearValidators();
      // this.form.get('resCounty').updateValueAndValidity();
      // this.form.get('responsible2').clearValidators();
      // this.form.get('responsible2').updateValueAndValidity();
      // this.form.get('relationship2').clearValidators();
      // this.form.get('relationship2').updateValueAndValidity();
      // this.form.get('phoneNo2').clearValidators();
      // this.form.get('phoneNo2').updateValueAndValidity();
      // this.form.get('resAddress12').clearValidators();
      // this.form.get('resAddress12').updateValueAndValidity();
      // this.form.get('resAddress22').clearValidators();
      // this.form.get('resAddress22').updateValueAndValidity();
      // this.form.get('resAddress32').clearValidators();
      // this.form.get('resAddress32').updateValueAndValidity();
      // this.form.get('resCounty2').clearValidators();
      // this.form.get('resCounty2').updateValueAndValidity();
      this.form.get('doctor').clearValidators();
      this.form.get('doctor').updateValueAndValidity();
      this.form.get('doctorNo').clearValidators();
      this.form.get('doctorNo').updateValueAndValidity();
      this.form.get('church').clearValidators();
      this.form.get('church').updateValueAndValidity();
      this.form.get('cemetery').clearValidators();
      this.form.get('cemetery').updateValueAndValidity();
      this.form.get('grave').clearValidators();
      this.form.get('grave').updateValueAndValidity();
      this.form.get('clergy').clearValidators();
      this.form.get('clergy').updateValueAndValidity();
      this.form.get('reposingAt').clearValidators();
      this.form.get('reposingAt').updateValueAndValidity();
      this.form.get('reposeDate').clearValidators();
      this.form.get('reposeDate').updateValueAndValidity();
      this.form.get('reposeTime').clearValidators();
      this.form.get('reposeTime').updateValueAndValidity();
      this.form.get('reposeEndTime').clearValidators();
      this.form.get('reposeEndTime').updateValueAndValidity();
      this.form.get('removalDate').clearValidators();
      this.form.get('removalDate').updateValueAndValidity();
      this.form.get('removalTime').clearValidators();
      this.form.get('removalTime').updateValueAndValidity();
      this.form.get('churchArrivalDate').clearValidators();
      this.form.get('churchArrivalDate').updateValueAndValidity();
      this.form.get('churchArrivalTime').clearValidators();
      this.form.get('churchArrivalTime').updateValueAndValidity();
      this.form.get('massDate').clearValidators();
      this.form.get('massDate').updateValueAndValidity();
      this.form.get('massTime').clearValidators();
      this.form.get('massTime').updateValueAndValidity();
      this.form.get('formType').clearValidators();
      this.form.get('formType').updateValueAndValidity();
      this.form.get('noticePar1').clearValidators();
      this.form.get('noticePar1').updateValueAndValidity();
      this.form.get('noticePar2').clearValidators();
      this.form.get('noticePar2').updateValueAndValidity();
      this.formType = this.horizon;
    } else if (this.listType === 'standard'){
      this.formType = this.form;
    } else if (this.listType === 'preNeed'){

      this.formType = this.form;
    }
  }
}
