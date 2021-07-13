import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Deceased } from '../deceased.model';
import { DeceasedService } from '../deceased.service';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.page.html',
  styleUrls: ['./edit-details.page.scss'],
})
export class EditDetailsPage implements OnInit {
  deceased: Deceased;
  deceasedId: string;
  form: FormGroup;
  isLoading = false;
  private deceasedSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private deceasedService: DeceasedService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('deceasedId')) {
        this.navCtrl.navigateBack('/menu/tabs/data-entry/deceased');
        return;
      }
      this.deceasedId = paramMap.get('deceasedId');
      this.isLoading = true;
      this.deceasedSub = this.deceasedService
        .getDeceased(paramMap.get('deceasedId'))
        .subscribe(
          deceased => {
            this.deceased = deceased;
            this.form = new FormGroup({
              deceasedName: new FormControl(this.deceased.deceasedName, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              deathDate: new FormControl(this.deceased.deathDate, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              age: new FormControl(this.deceased.age, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              dob: new FormControl(this.deceased.age, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              deathPlace: new FormControl(this.deceased.deathPlace, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              address1: new FormControl(this.deceased.address1, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              address2: new FormControl(this.deceased.address2, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              address3: new FormControl(this.deceased.address3, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              county: new FormControl(this.deceased.county, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              contact: new FormGroup({
                responsible: new FormControl(this.deceased.contact.responsible, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                relationship: new FormControl(this.deceased.contact.relationship, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                phoneNo: new FormControl(this.deceased.contact.phoneNo, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                resAddress1: new FormControl(this.deceased.contact.resAddress1, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                resAddress2: new FormControl(this.deceased.contact.resAddress2, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                resAddress3: new FormControl(this.deceased.contact.resAddress3, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                resCounty: new FormControl(this.deceased.contact.resCounty, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                responsible2: new FormControl(this.deceased.contact.responsible, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                relationship2: new FormControl(this.deceased.contact.relationship, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                phoneNo2: new FormControl(this.deceased.contact.phoneNo, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                resAddress12: new FormControl(this.deceased.contact.resAddress1, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                resAddress22: new FormControl(this.deceased.contact.resAddress2, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                resAddress32: new FormControl(this.deceased.contact.resAddress3, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
                resCounty2: new FormControl(this.deceased.contact.resCounty, {
                  updateOn: 'blur',
                  validators: [Validators.required]
                }),
              }),
              doctor: new FormControl(this.deceased.doctor, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              doctorNo: new FormControl(this.deceased.doctorNo, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              church: new FormControl(this.deceased.church, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              cemetry: new FormControl(this.deceased.cemetry, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              grave: new FormControl(this.deceased.grave, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              clergy: new FormControl(this.deceased.clergy, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              reposeDate: new FormControl(this.deceased.reposeDate, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              reposeTime: new FormControl(this.deceased.reposeTime, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              removalDate: new FormControl(this.deceased.removalTime, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              removalTime: new FormControl(this.deceased.removalTime, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              churchArrivalDate: new FormControl(this.deceased.churchArrivalTime, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              churchArrivalTime: new FormControl(this.deceased.churchArrivalTime, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              massDate: new FormControl(this.deceased.massDate, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              massTime: new FormControl(this.deceased.massTime, {
                updateOn: 'blur',
                validators: [Validators.required]
              })
            });
            this.isLoading = false;
          },
          error => {
            this.alertCtrl
              .create({
                header: 'An error occurred!',
                message: 'Deceased information could not be fetched. Please try again later.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/menu/tabs/data-entry/deceased']);
                    }
                  }
                ]
              })
              .then(alertEl => {
                alertEl.present();
              });
          }
        );
    });
  }

  onUpdateDeceased(){
    if (!this.form.valid) {
      console.log('fucked');
      return;
    }
    console.log('fucked');
    this.loadingCtrl
      .create({
        message: 'Updating Deceased Information...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.deceasedService
          .updateDeceased(
            this.deceased.id,
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
            this.form.value.cemetry,
            this.form.value.grave,
            this.form.value.clergy,
            this.form.value.reposeDate,
            this.form.value.reposeTime,
            this.form.value.removalDate,
            this.form.value.removalTime,
            this.form.value.churchArrivalDate,
            this.form.value.churchArrivalTime,
            this.form.value.massDate,
            this.form.value.massTime,
            this.deceased.entryDate,
            this.deceased.formType
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/menu/tabs/data-entry/deceased']);
          });
      });
  }

}
