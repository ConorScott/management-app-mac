/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Deceased } from '../deceased-details/deceased.model';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Contact } from '../../../shared/contact';
import { BehaviorSubject, of, pipe } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CalendarService } from '../../calendar/calendar.service';
import { ReportsPageRoutingModule } from '../../reports/reports-routing.module';

interface DeceasedData {
  deceasedName: string;
  deathDate: string;
  age: number;
  dob: Date;
  deathPlace: string;
  address1: string;
  address2: string;
  address3: string;
  county: string;
  contact: Contact;
  doctor: string;
  doctorNo: number;
  church: string;
  cemetry: string;
  grave: string;
  clergy: string;
  reposeDate: Date;
  reposeTime: Date;
  removalDate: Date;
  removalTime: Date;
  churchArrivalDate: Date;
  churchArrivalTime: Date;
  massDate: Date;
  massTime: Date;
  entryDate: Date;
  formType: string;
  createdBy: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeceasedService {
  private _deceased = new BehaviorSubject<Deceased[]>([]);
  private _contact = new BehaviorSubject<Contact[]>([]);

  get deceased() {
    // eslint-disable-next-line no-underscore-dangle
    return this._deceased.asObservable();
  }
  get contact() {
    // eslint-disable-next-line no-underscore-dangle
    return this._contact.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient, private calendarService: CalendarService) {}

  addDeceased(
    deceasedName: string,
    deathDate: string,
    age: number,
    dob: Date,
    deathPlace: string,
    address1: string,
    address2: string,
    address3: string,
    county: string,
    contact: Contact,
    doctor: string,
    doctorNo: number,
    church: string,
    cemetry: string,
    grave: string,
    clergy: string,
    reposeDate: Date,
    reposeTime: Date,
    removalDate: Date,
    removalTime: Date,
    churchArrivalDate: Date,
    churchArrivalTime: Date,
    massDate: Date,
    massTime: Date,
    entryDate: Date,
    formType: string,
    createdBy: string
  ) {
    let generateId: string;
    let newDeceased: Deceased;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        if (!fetchedUserId) {
          throw new Error('No user id found!');
        }
        newDeceased = new Deceased(
          Math.random().toString(),
          deceasedName,
          deathDate,
          age,
          dob,
          deathPlace,
          address1,
          address2,
          address3,
          county,
          contact,
          doctor,
          doctorNo,
          church,
          cemetry,
          grave,
          clergy,
          reposeDate,
          reposeTime,
          removalDate,
          removalTime,
          churchArrivalDate,
          churchArrivalTime,
          massDate,
          massTime,
          entryDate,
          formType,
          createdBy
        );
        this.addContact(contact).subscribe();
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/deceased-details.json?auth=${token}`,
          { ...newDeceased, id: null }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.deceased;
      }),
      take(1),
      tap((deceased) => {
        newDeceased.id = generateId;
        this.calendarService.reposeDate( deceasedName, reposeDate, reposeTime);
        this.calendarService.removalTime( deceasedName, removalDate, removalTime);
        this.calendarService.churchArrivalTime( deceasedName, churchArrivalDate, churchArrivalTime);
        this.calendarService.massTime( deceasedName, massDate, massTime);
        // eslint-disable-next-line no-underscore-dangle
        this._deceased.next(deceased.concat(newDeceased));
      })
    );
  }

  addContact(contact) {
    let generatedId: string;
    let fetchedUserId: string;
    let newContact: Contact;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
       switchMap(token => {
      if (!fetchedUserId) {
        throw new Error('No user found!');
      }
      return this.http
        .post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/contact.json?auth=${token}`,
          contact
        );
    }),
        switchMap(resData => {
          generatedId = resData.name;
          return this.contact;
        }),
        take(1),
        tap(contacts => {
          contact.id = generatedId;
          this._contact.next(contacts.concat(contact));
        })
      );
    console.log(contact);
    this.http
      .post(
        'https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/contact.json',
        contact
      )
      .subscribe((res) => {});
  }

  fetchDeceased(formType) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: DeceasedData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/deceased-details.json?auth=${token}`
        );
      }),
      map((resData) => {
        const deceased = [];
        for (const key in resData) {
          if (
            resData.hasOwnProperty(key) &&
            resData[key].formType === formType
          ) {
            deceased.push(
              new Deceased(
                key,
                resData[key].deceasedName,
                resData[key].deathDate,
                resData[key].age,
                resData[key].dob,
                resData[key].deathPlace,
                resData[key].address1,
                resData[key].address2,
                resData[key].address3,
                resData[key].county,
                resData[key].contact,
                resData[key].doctor,
                resData[key].doctorNo,
                resData[key].church,
                resData[key].cemetry,
                resData[key].grave,
                resData[key].clergy,
                resData[key].reposeDate,
                resData[key].reposeTime,
                resData[key].removalDate,
                resData[key].removalTime,
                resData[key].churchArrivalDate,
                resData[key].churchArrivalTime,
                resData[key].massDate,
                resData[key].massTime,
                resData[key].entryDate,
                resData[key].formType,
                resData[key].createdBy
              )
            );
          }
        }
        return deceased.reverse();
      }),
      tap((deceased) => {
        this._deceased.next(deceased);
      })
    );
  }

  fetchDeceasedAddress(name, responsible) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: DeceasedData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/deceased-details.json?auth=${token}`
        );
      }),
      map((resData) => {
        const deceased = [];
        for (const key in resData) {
          if (
            resData.hasOwnProperty(key) &&
            resData[key].deceasedName === name &&
            resData[key].contact.responsible === responsible
          ) {
            deceased.push(
              new Deceased(
                key,
                resData[key].deceasedName,
                resData[key].deathDate,
                resData[key].age,
                resData[key].dob,
                resData[key].deathPlace,
                resData[key].address1,
                resData[key].address2,
                resData[key].address3,
                resData[key].county,
                resData[key].contact,
                resData[key].doctor,
                resData[key].doctorNo,
                resData[key].church,
                resData[key].cemetry,
                resData[key].grave,
                resData[key].clergy,
                resData[key].reposeDate,
                resData[key].reposeTime,
                resData[key].removalDate,
                resData[key].removalTime,
                resData[key].churchArrivalDate,
                resData[key].churchArrivalTime,
                resData[key].massDate,
                resData[key].massTime,
                resData[key].entryDate,
                resData[key].formType,
                resData[key].createdBy
              )
            );
          }
        }
        return deceased.reverse();
      }),
      tap((deceased) => {
        this._deceased.next(deceased);
      })
    );
  }

  fetchDeceasedInvoice() {
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('User not Found');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: DeceasedData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/deceased-details.json?auth=${token}`
        );
      }),
      map((resData) => {
        const deceased = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            deceased.push(
              new Deceased(
                key,
                resData[key].deceasedName,
                resData[key].deathDate,
                resData[key].age,
                resData[key].dob,
                resData[key].deathPlace,
                resData[key].address1,
                resData[key].address2,
                resData[key].address3,
                resData[key].county,
                resData[key].contact,
                resData[key].doctor,
                resData[key].doctorNo,
                resData[key].church,
                resData[key].cemetry,
                resData[key].grave,
                resData[key].clergy,
                resData[key].reposeDate,
                resData[key].reposeTime,
                resData[key].removalDate,
                resData[key].removalTime,
                resData[key].churchArrivalDate,
                resData[key].churchArrivalTime,
                resData[key].massDate,
                resData[key].massTime,
                resData[key].entryDate,
                resData[key].formType,
                resData[key].createdBy
              )
            );
          }
        }
        return deceased.reverse();
      }),
      tap((deceased) => {
        this._deceased.next(deceased);
      })
    );
  }

  getDeceased(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<DeceasedData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/deceased-details/${id}.json?auth=${token}`
        );
      }),
      map((resData) => {
        return new Deceased(
          id,
          resData.deceasedName,
          resData.deathDate,
          resData.age,
          resData.dob,
          resData.deathPlace,
          resData.address1,
          resData.address2,
          resData.address3,
          resData.county,
          resData.contact,
          resData.doctor,
          resData.doctorNo,
          resData.church,
          resData.cemetry,
          resData.grave,
          resData.clergy,
          resData.reposeDate,
          resData.reposeTime,
          resData.removalDate,
          resData.removalTime,
          resData.churchArrivalDate,
          resData.churchArrivalTime,
          resData.massDate,
          resData.massTime,
          resData.entryDate,
          resData.formType,
          resData.createdBy
        );
      })
    );
  }

  updateDeceased(
    deceasedId: string,
    deceasedName: string,
    deathDate: string,
    age: number,
    dob: Date,
    deathPlace: string,
    address1: string,
    address2: string,
    address3: string,
    county: string,
    contact: Contact,
    doctor: string,
    doctorNo: number,
    church: string,
    cemetry: string,
    grave: string,
    clergy: string,
    reposeDate: Date,
    reposeTime: Date,
    removalDate: Date,
    removalTime: Date,
    churchArrivalDate: Date,
    churchArrivalTime: Date,
    massDate: Date,
    massTime: Date,
    createdAt: Date,
    formType: string,
    createdBy: string,
    reposeId: string,
    removalId: string,
    massDateId: string,
    churchArrivalId: string
  ) {
    this.calendarService.updateReposeDate(reposeId, deceasedName, reposeDate, reposeTime);
    this.calendarService.updateRemovalTime(removalId, deceasedName, removalDate, removalTime);
    this.calendarService.updateMassTime(massDateId, deceasedName, massDate, massTime);
    this.calendarService.updateChurchArrivalTime(churchArrivalId, deceasedName, churchArrivalDate, churchArrivalTime);
    let updateDeceasedInfo: Deceased[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.deceased;
      }),
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchDeceased(formType);
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const updateDeceasedIndex = places.findIndex(
          (pl) => pl.id === deceasedId
        );
        updateDeceasedInfo = [...places];
        const oldDeceasedInfo = updateDeceasedInfo[updateDeceasedIndex];
        updateDeceasedInfo[updateDeceasedIndex] = new Deceased(
          oldDeceasedInfo.id,
          deceasedName,
          deathDate,
          age,
          dob,
          deathPlace,
          address1,
          address2,
          address3,
          county,
          contact,
          doctor,
          doctorNo,
          church,
          cemetry,
          grave,
          clergy,
          reposeDate,
          reposeTime,
          removalDate,
          removalTime,
          churchArrivalDate,
          churchArrivalTime,
          massDate,
          massTime,
          createdAt,
          formType,
          oldDeceasedInfo.createdBy
        );
        return this.http.put(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/deceased-details/${deceasedId}.json?auth=${fetchedToken}`,
          { ...updateDeceasedInfo[updateDeceasedIndex], id: null }
        );
      }),
      tap(() => {
        this._deceased.next(updateDeceasedInfo);
      })
    );
  }

  cancelBooking(deceasedId: string) {
    return this.authService.token.pipe(
      take(1),
      // eslint-disable-next-line arrow-body-style
      switchMap((token) => {
        return this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/deceased-details/${deceasedId}.json?auth=${token}`
        );
      }),
      // eslint-disable-next-line arrow-body-style
      switchMap(() => {
        return this.deceased;
      }),
      take(1),
      tap((deceased) => {
        // eslint-disable-next-line no-underscore-dangle
        this._deceased.next(deceased.filter((b) => b.id !== deceasedId));
      })
    );
  }
}
