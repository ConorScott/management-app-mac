/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Deceased } from '../deceased-details/deceased.model';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Contact } from '../../../shared/contact';
import { BehaviorSubject, from, of, pipe } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CalendarService } from '../../calendar/calendar.service';
import { ReportsPageRoutingModule } from '../../reports/reports-routing.module';
import { ApiService } from 'src/app/services/api.service';
import { ConnectionStatus, NetworkService } from 'src/app/services/network.service';
import { StorageService } from 'src/app/services/storage-service.service';
import { OfflineManagerService } from 'src/app/services/offline-manager.service';

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
  reposingAt: string;
  reposeDate: Date;
  reposeTime: Date;
  reposeEndTime: Date;
  removalDate: Date;
  removalTime: Date;
  churchArrivalDate: Date;
  churchArrivalTime: Date;
  massDate: Date;
  massTime: Date;
  entryDate: Date;
  formType: string;
  createdBy: string;
  noticePar1: string;
  noticePar2: string;
  specialRequests: string;
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

  constructor(private authService: AuthService, private http: HttpClient, private offlineManager: OfflineManagerService,  private calendarService: CalendarService, private apiService: ApiService, private networkService: NetworkService, private storageService: StorageService) {}

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
    reposingAt: string,
    reposeDate: Date,
    reposeTime: Date,
    reposeEndTime: Date,
    removalDate: Date,
    removalTime: Date,
    churchArrivalDate: Date,
    churchArrivalTime: Date,
    massDate: Date,
    massTime: Date,
    entryDate: Date,
    formType: string,
    createdBy: string,
    noticePar1: string,
    noticePar2: string,
    specialRequests: string
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
          reposingAt,
          reposeDate,
          reposeTime,
          reposeEndTime,
          removalDate,
          removalTime,
          churchArrivalDate,
          churchArrivalTime,
          massDate,
          massTime,
          entryDate,
          formType,
          createdBy,
          noticePar1,
          noticePar2,
          specialRequests
        );
        this.addContact(contact).subscribe();
        let url =`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/deceased-details.json?auth=${token}`;
        let data = {...newDeceased, id: null};
        if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
          return from(this.offlineManager.storeRequest(url, 'POST', data));
        } else {
          return this.http.post<{ name: string }>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/deceased-details.json?auth=${token}`,
            { ...newDeceased, id: null }
          );
        }

      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.deceased;
      }),
      take(1),
      tap((deceased) => {
        newDeceased.id = generateId;
        console.log("Generated Id:" + generateId);
        if(reposeDate !== null){
          this.calendarService.reposeDate( deceasedName, reposeDate, reposeTime, reposeEndTime, generateId);
        }
        if(removalDate !== null){
          this.calendarService.removalTime( deceasedName, removalDate, removalTime, generateId);

        }
        if(churchArrivalDate !== null){
          this.calendarService.churchArrivalTime( deceasedName, churchArrivalDate, churchArrivalTime, generateId);
        }
        if(massDate !== null){
          this.calendarService.massTime( deceasedName, massDate, massTime, generateId);
        }
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
      let url =`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/contact.json?auth=${token}`;
        let data = {contact};
        if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
          return from(this.offlineManager.storeRequest(url, 'POST', data));
        } else {
          return this.http
          .post<{ name: string }>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/contact.json?auth=${token}`,
            contact
          );
        }

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

    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('deceased'))
    } else {
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
                  resData[key].reposingAt,
                  resData[key].reposeDate,
                  resData[key].reposeTime,
                  resData[key].reposeEndTime,
                  resData[key].removalDate,
                  resData[key].removalTime,
                  resData[key].churchArrivalDate,
                  resData[key].churchArrivalTime,
                  resData[key].massDate,
                  resData[key].massTime,
                  resData[key].entryDate,
                  resData[key].formType,
                  resData[key].createdBy,
                  resData[key].noticePar1,
                  resData[key].noticePar2,
                  resData[key].specialRequests
                )
              );
            }
          }
          return deceased.reverse();
        }),
        tap((deceased) => {
          this.apiService.setLocalData('deceased', deceased);
          this._deceased.next(deceased);
        })
      );
    }

  }

  fetchDeceasedAddress(name, responsible) {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('deceasedAddress'))
    } else {
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
                  resData[key].reposingAt,
                  resData[key].reposeDate,
                  resData[key].reposeTime,
                  resData[key].reposeEndTime,
                  resData[key].removalDate,
                  resData[key].removalTime,
                  resData[key].churchArrivalDate,
                  resData[key].churchArrivalTime,
                  resData[key].massDate,
                  resData[key].massTime,
                  resData[key].entryDate,
                  resData[key].formType,
                  resData[key].createdBy,
                  resData[key].noticePar1,
                  resData[key].noticePar2,
                  resData[key].specialRequests
                )
              );
            }
          }
          return deceased.reverse();
        }),
        tap((deceased) => {
          this.apiService.setLocalData('deceasedAddress', deceased);
        })
      );
    }

  }

  fetchDeceasedInvoice() {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('deceasedInvoice'))
    } else {
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
                  resData[key].reposingAt,
                  resData[key].reposeDate,
                  resData[key].reposeTime,
                  resData[key].reposeEndTime,
                  resData[key].removalDate,
                  resData[key].removalTime,
                  resData[key].churchArrivalDate,
                  resData[key].churchArrivalTime,
                  resData[key].massDate,
                  resData[key].massTime,
                  resData[key].entryDate,
                  resData[key].formType,
                  resData[key].createdBy,
                  resData[key].noticePar1,
                  resData[key].noticePar2,
                  resData[key].specialRequests
                )
              );
            }
          }
          return deceased.reverse();
        }),
        tap((deceased) => {
          this.apiService.setLocalData('deceasedInvoice', deceased);
          this._deceased.next(deceased);
        })
      );
    }

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
          resData.reposingAt,
          resData.reposeDate,
          resData.reposeTime,
          resData.reposeEndTime,
          resData.removalDate,
          resData.removalTime,
          resData.churchArrivalDate,
          resData.churchArrivalTime,
          resData.massDate,
          resData.massTime,
          resData.entryDate,
          resData.formType,
          resData.createdBy,
          resData.noticePar1,
          resData.noticePar2,
          resData.specialRequests
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
    reposingAt: string,
    reposeDate: Date,
    reposeTime: Date,
    reposeEndTime: Date,
    removalDate: Date,
    removalTime: Date,
    churchArrivalDate: Date,
    churchArrivalTime: Date,
    massDate: Date,
    massTime: Date,
    createdAt: Date,
    formType: string,
    createdBy: string,
    noticePar1: string,
    noticePar2: string,
    specialRequests: string,
    reposeId: string,
    removalId: string,
    massDateId: string,
    churchArrivalId: string
  ) {
    if(reposeDate !== null){
      this.calendarService.updateReposeDate(reposeId, deceasedName, reposeDate, reposeTime, reposeEndTime);

    }
    if(removalDate !== null){
      this.calendarService.updateRemovalTime(removalId, deceasedName, removalDate, removalTime);

    }
    if(massDate !== null){
      this.calendarService.updateMassTime(massDateId, deceasedName, massDate, massTime);

    }
    if(churchArrivalDate !== null){
      this.calendarService.updateChurchArrivalTime(churchArrivalId, deceasedName, churchArrivalDate, churchArrivalTime);

    }
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
          reposingAt,
          reposeDate,
          reposeTime,
          reposeEndTime,
          removalDate,
          removalTime,
          churchArrivalDate,
          churchArrivalTime,
          massDate,
          massTime,
          createdAt,
          formType,
          oldDeceasedInfo.createdBy,
          noticePar1,
          noticePar2,
          specialRequests
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

  transferDeceased(
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
    reposingAt: string,
    reposeDate: Date,
    reposeTime: Date,
    reposeEndTime: Date,
    removalDate: Date,
    removalTime: Date,
    churchArrivalDate: Date,
    churchArrivalTime: Date,
    massDate: Date,
    massTime: Date,
    createdAt: Date,
    formType: string,
    createdBy: string,
    noticePar1: string,
    noticePar2: string,
    specialRequests: string,
  ) {
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
          reposingAt,
          reposeDate,
          reposeTime,
          reposeEndTime,
          removalDate,
          removalTime,
          churchArrivalDate,
          churchArrivalTime,
          massDate,
          massTime,
          createdAt,
          formType,
          oldDeceasedInfo.createdBy,
          noticePar1,
          noticePar2,
          specialRequests
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
    this.calendarService.fetchEventInfo(deceasedId).subscribe();
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
