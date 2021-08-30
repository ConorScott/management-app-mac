/* eslint-disable prefer-const */
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CalendarService } from 'src/app/menu/calendar/calendar.service';
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
  reposeId: string;
  removalId: string;
  churchArrivalId: string;
  massDateId: string;
  form: FormGroup;
  isLoading = false;
  private deceasedSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private deceasedService: DeceasedService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private calendarService: CalendarService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('deceasedId')) {
        this.navCtrl.navigateBack('/menu/tabs/data-entry/deceased');
        return;
      }
      this.deceasedId = paramMap.get('deceasedId');
      this.isLoading = true;
      this.deceasedSub = this.deceasedService
        .getDeceased(paramMap.get('deceasedId'))
        .subscribe(
          (deceased) => {
            this.deceased = deceased;
            if (this.deceased.reposeDate !== undefined) {
              this.calendarService
                .getEvent(deceased.deceasedName + ' Repose Date')
                .subscribe((event) => {
                  this.reposeId = event.id;
                  console.log(this.reposeId);
                });
            }
            if (this.deceased.removalDate !== undefined) {
              this.calendarService
                .getEvent(deceased.deceasedName + ' Removal Date')
                .subscribe((event) => {
                  this.removalId = event.id;
                  console.log(this.removalId);
                });
            }
            if (this.deceased.massDate) {
              this.calendarService
                .getEvent(deceased.deceasedName + ' Mass Date')
                .subscribe((event) => {
                  this.massDateId = event.id;
                  console.log(this.massDateId);
                });
            }

            if (this.deceased.churchArrivalDate !== undefined) {
              this.calendarService
                .getEvent(deceased.deceasedName + ' church Arrival Date')
                .subscribe((event) => {
                  this.churchArrivalId = event.id;
                  console.log(this.churchArrivalId);
                });
            }

            this.form = new FormGroup({
              deceasedName: new FormControl(this.deceased.deceasedName, {
                updateOn: 'blur',

              }),
              deathDate: new FormControl(this.deceased.deathDate, {
                updateOn: 'blur',

              }),
              age: new FormControl(this.deceased.age, {
                updateOn: 'blur',

              }),
              dob: new FormControl(this.deceased.dob, {
                updateOn: 'blur',

              }),
              deathPlace: new FormControl(this.deceased.deathPlace, {
                updateOn: 'blur',

              }),
              address1: new FormControl(this.deceased.address1, {
                updateOn: 'blur',

              }),
              address2: new FormControl(this.deceased.address2, {
                updateOn: 'blur',

              }),
              address3: new FormControl(this.deceased.address3, {
                updateOn: 'blur',

              }),
              county: new FormControl(this.deceased.county, {
                updateOn: 'blur',

              }),
              contact: new FormGroup({
                responsible: new FormControl(
                  this.deceased.contact?.responsible,
                  {
                    updateOn: 'blur',

                  }
                ),
                relationship: new FormControl(
                  this.deceased.contact?.relationship,
                  {
                    updateOn: 'blur',

                  }
                ),
                phoneNo: new FormControl(this.deceased.contact?.phoneNo, {
                  updateOn: 'blur',

                }),
                resAddress1: new FormControl(
                  this.deceased.contact?.resAddress1,
                  {
                    updateOn: 'blur',

                  }
                ),
                resAddress2: new FormControl(
                  this.deceased.contact?.resAddress2,
                  {
                    updateOn: 'blur',

                  }
                ),
                resAddress3: new FormControl(
                  this.deceased.contact?.resAddress3,
                  {
                    updateOn: 'blur',

                  }
                ),
                resCounty: new FormControl(this.deceased.contact?.resCounty, {
                  updateOn: 'blur',

                }),
                responsible2: new FormControl(
                  this.deceased.contact?.responsible2,
                  {
                    updateOn: 'blur',

                  }
                ),
                relationship2: new FormControl(
                  this.deceased.contact?.relationship2,
                  {
                    updateOn: 'blur',

                  }
                ),
                phoneNo2: new FormControl(this.deceased.contact?.phoneNo2, {
                  updateOn: 'blur',

                }),
                resAddress12: new FormControl(
                  this.deceased.contact?.resAddress12,
                  {
                    updateOn: 'blur',

                  }
                ),
                resAddress22: new FormControl(
                  this.deceased.contact?.resAddress22,
                  {
                    updateOn: 'blur',

                  }
                ),
                resAddress32: new FormControl(
                  this.deceased.contact?.resAddress32,
                  {
                    updateOn: 'blur',

                  }
                ),
                resCounty2: new FormControl(this.deceased.contact?.resCounty2, {
                  updateOn: 'blur',

                }),
              }),
              doctor: new FormControl(this.deceased.doctor, {
                updateOn: 'blur',

              }),
              doctorNo: new FormControl(this.deceased.doctorNo, {
                updateOn: 'blur',

              }),
              church: new FormControl(this.deceased.church, {
                updateOn: 'blur',

              }),
              cemetry: new FormControl(this.deceased.cemetry, {
                updateOn: 'blur',

              }),
              grave: new FormControl(this.deceased.grave, {
                updateOn: 'blur',

              }),
              clergy: new FormControl(this.deceased.clergy, {
                updateOn: 'blur',

              }),
              reposingAt: new FormControl(this.deceased.reposingAt, {
                updateOn: 'blur',

              }),
              reposeDate: new FormControl(this.deceased.reposeDate, {
                updateOn: 'blur',

              }),
              reposeTime: new FormControl(this.deceased.reposeTime, {
                updateOn: 'blur',

              }),
              reposeEndTime: new FormControl(this.deceased.reposeEndTime, {
                updateOn: 'blur',

              }),
              removalDate: new FormControl(this.deceased.removalDate, {
                updateOn: 'blur',

              }),
              removalTime: new FormControl(this.deceased.removalTime, {
                updateOn: 'blur',

              }),
              churchArrivalDate: new FormControl(
                this.deceased.churchArrivalDate,
                {
                  updateOn: 'blur',

                }
              ),
              churchArrivalTime: new FormControl(
                this.deceased.churchArrivalTime,
                {
                  updateOn: 'blur',

                }
              ),
              massDate: new FormControl(this.deceased.massDate, {
                updateOn: 'blur',

              }),
              massTime: new FormControl(this.deceased.massTime, {
                updateOn: 'blur',

              }),
              noticePar1: new FormControl(this.deceased.noticePar1, {
                updateOn: 'blur',

              }),
              noticePar2: new FormControl(this.deceased.noticePar2, {
                updateOn: 'blur',

              }),
              specialRequests: new FormControl(this.deceased.specialRequests, {
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

  onUpdateDeceased() {
    if (!this.form.valid) {
      return;
    }
    this.updateNotice();
    this.loadingCtrl
      .create({
        message: 'Updating Deceased Information...',
      })
      .then((loadingEl) => {
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
            this.deceased.entryDate,
            this.deceased.formType,
            this.deceased.createdBy,
            this.form.value.noticePar1,
            this.form.value.noticePar2,
            this.form.value.specialRequests,
            this.reposeId,
            this.removalId,
            this.massDateId,
            this.churchArrivalId
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/menu/tabs/data-entry/deceased']);
          });
      });
  }

  updateNotice() {
    let nameDeceased: string;
    let name: string;
    name = this.form.value.deceasedName;
    nameDeceased = name.split(' ')[0];

    let noticeReposeStart: string;
    noticeReposeStart = this.form.value.reposeTime;
    noticeReposeStart = this.datePipe.transform(noticeReposeStart, 'hh:mm a');

    let noticeReposeEnd: string;
    noticeReposeEnd = this.form.value.reposeEndTime;
    noticeReposeEnd = this.datePipe.transform(noticeReposeEnd, 'hh:mm a');

    let massTime: string;
    massTime = this.form.value.massTime;
    massTime = this.datePipe.transform(massTime, 'hh:mm a');

    this.form.controls.noticePar2.setValue(
      // eslint-disable-next-line max-len
      `Reposing at ${this.form.value.reposingAt} from ${noticeReposeStart} to ${noticeReposeEnd}. Funeral will leave ${this.form.value.reposingAt} to arrive at ${this.form.value.church} for Requiem mass at ${massTime}. Funeral will proceed to ${this.form.value.cemetry}. Due to current restrictions, ${nameDeceased}'s funeral will be private to family, relatives and friends. House private please (optional) Family flowers only. Donations in lieu of flowers if desired to (Charity) care of McGowan's funeral home, Emmet St, Ballina, Co. Mayo (or Foley & McGowan's Funeral Home, Market Yard, Sligo)You are welcome to send a message of condolence to his/her family on the funeral home website.`
    );
  }
}
