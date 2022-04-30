/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { ConnectionStatus, NetworkService } from 'src/app/services/network.service';
import { OfflineManagerService } from 'src/app/services/offline-manager.service';
import { StorageService } from 'src/app/services/storage-service.service';
import { CashBook } from './cashbbok.model';

interface CashBookData {
  id: string;
  entryDate: Date;
  entryAmount: number;
  entryDesc: string;
  payeeName: string;
 }

@Injectable({
  providedIn: 'root'
})
export class CashbookService {
  private _cashbook = new BehaviorSubject<CashBook[]>([]);

  get cashbook() {
    return this._cashbook.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService, private networkService: NetworkService,
    private offlineManager: OfflineManagerService,
    private storageService: StorageService, private apiService: ApiService) { }

  addCashBook(entryDate: Date, entryAmount: number, entryDesc: string, payeeName: string) {
    let generateId: string;
    let newEntry: CashBook;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newEntry = new CashBook(Math.random().toString(), entryDate, entryAmount, entryDesc, payeeName);
        let url =`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cashbook.json?auth=${token}`;
        let data = {...newEntry, id: null};
        if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
          return from(this.offlineManager.storeRequest(url, 'POST', data));
        } else {
          return this.http.post<{ name: string }>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cashbook.json?auth=${token}`,
            { ...newEntry, id: null }
          );
        }

      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.cashbook;
      }),
      take(1),
      tap((cashbook) => {
        newEntry.id = generateId;
        this._cashbook.next(cashbook.concat(newEntry));
      })
    );
  }

  addGraveDiggerPayment(entryDate: Date, deceasedName: string, cemeteryName: string) {
    let generateId: string;
    let newEntry: CashBook;
    let fetchedUserId: string;
    const entryDesc = `Payment of €60 made to Brian Scanlon and Terry Butler for Grave Digging for the burial of ${deceasedName}`;
    const entryAmount = 60;
    const name = 'Grave Diggers';
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newEntry = new CashBook(Math.random().toString(), entryDate, entryAmount, entryDesc, name);
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cashbook.json?auth=${token}`,
          { ...newEntry, id: null }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.cashbook;
      }),
      take(1),
      tap((cashbook) => {
        newEntry.id = generateId;
        this._cashbook.next(cashbook.concat(newEntry));
      })
    );
  }

  addSacristanPayment(entryDate: Date) {
    let generateId: string;
    let newEntry: CashBook;
    let fetchedUserId: string;
    const entryDesc = `Sacristan Payment of €50 made to St. Anne’s Church Sligo`;
    const entryAmount = 50;
    const name = 'Sacristan';
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newEntry = new CashBook(Math.random().toString(), entryDate, entryAmount, entryDesc, name);
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cashbook.json?auth=${token}`,
          { ...newEntry, id: null }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.cashbook;
      }),
      take(1),
      tap((cashbook) => {
        newEntry.id = generateId;
        this._cashbook.next(cashbook.concat(newEntry));
      })
    );
  }

  fetchCashBook() {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('cashbook'))
    } else {
      return this.authService.token.pipe(
        take(1),
        switchMap((token) => this.http.get<{ [key: string]: CashBookData }>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cashbook.json?auth=${token}`
          )),
        map((resData) => {
          const cashbook = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              cashbook.push(new CashBook(
                key,
                resData[key].entryDate,
                resData[key].entryAmount,
                resData[key].entryDesc,
                resData[key].payeeName
                ));
            }
          }
          return cashbook.reverse();
        }),
        tap((cashbook) => {
          this.apiService.setLocalData('cashbook', cashbook);
          this._cashbook.next(cashbook);
        })
      );
    }

  }

  getCashBook(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.get<CashBookData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cashbook/${id}.json?auth=${token}`
        )),
      map((resData) => new CashBook(
         id,
         resData.entryDate,
         resData.entryAmount,
         resData.entryDesc,
         resData.payeeName
         ))
    );
  }

  updateCashBook(cashbookId: string, entryDate: Date, entryAmount: number, entryDesc: string, payeeName: string) {
    let updateCashBook: CashBook[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.cashbook;
      }),
      take(1),
      switchMap((donation) => {
        if (!donation || donation.length <= 0) {
          return this.fetchCashBook();
        } else {
          return of(donation);
        }
      }),
      switchMap((donation) => {
        const updateCashBookIndex = donation.findIndex(
          (pl) => pl.id === cashbookId
        );
        updateCashBook = [...donation];
        const oldDonation = updateCashBook[updateCashBookIndex];

        updateCashBook[updateCashBookIndex] = new CashBook(
          oldDonation.id,
          entryDate,
          entryAmount,
          entryDesc,
          payeeName
        );
        return this.http.put<CashBook>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cashbook/${cashbookId}.json?auth=${fetchedToken}`,
          { ...updateCashBook[updateCashBookIndex], id: null }
        );
      }),
      tap(() => {
        this._cashbook.next(updateCashBook);
      })
    );
  }

  deleteCashBook(cashbookId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/cashbook/${cashbookId}.json?auth=${token}`
        )),
      switchMap(() => this.cashbook),
      take(1),
      tap((cashbook) => {
        this._cashbook.next(cashbook.filter((b) => b.id !== cashbookId));
      })
    );
  }
}
