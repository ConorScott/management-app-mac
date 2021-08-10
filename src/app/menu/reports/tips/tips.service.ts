/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Tips } from './tips.model';

interface TipData {
  id: string;
  entryDate: Date;
  entryAmount: number;
  entryDesc: string;
  payeeName: string;
  paymentDate?: Date;
 }

@Injectable({
  providedIn: 'root'
})
export class TipsService {
  private _tip = new BehaviorSubject<Tips[]>([]);

  get tips() {
    return this._tip.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) { }

  addTips(entryDate: Date, entryAmount: number, entryDesc: string, payeeName: string, createdAt: Date) {
    let generateId: string;
    let newEntry: Tips;
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
        newEntry = new Tips(Math.random().toString(), createdAt, entryAmount, entryDesc, payeeName, entryDate);
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tips.json?auth=${token}`,
          { ...newEntry, id: null }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.tips;
      }),
      take(1),
      tap((tips) => {
        newEntry.id = generateId;
        this._tip.next(tips.concat(newEntry));
      })
    );
  }

  fetchTotalPayments(name: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: TipData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tips.json?auth=${token}`
      );
    }), map((resData) => {
      const tips = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key) &&
        resData[key].payeeName === name) {
          tips.push(
            new Tips(
              key,
              resData[key].entryDate,
              resData[key].entryAmount,
              resData[key].entryDesc,
              resData[key].payeeName,
            )
          );
        }
      }
      return tips;
    }),
    tap((tips) => {
      this._tip.next(tips);
    })
    );
  }

  addGraveDiggerPaymentBrian(entryDate: Date, deceasedName: string, cemeteryName: string) {
    let generateId: string;
    let newEntry: Tips;
    let fetchedUserId: string;
    const entryDesc = `Payment of €30 made to Brian Scanlon for the burial of ${deceasedName}`;
    const entryAmount = 30;
    const name = 'Brian Scanlon';
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
        newEntry = new Tips(Math.random().toString(), entryDate, entryAmount, entryDesc, name);
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tips.json?auth=${token}`,
          { ...newEntry, id: null }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.tips;
      }),
      take(1),
      tap((tip) => {
        newEntry.id = generateId;
        this._tip.next(tip.concat(newEntry));
      })
    );
  }

  addGraveDiggerPaymentTerry(entryDate: Date, deceasedName: string, cemeteryName: string) {
    let generateId: string;
    let newEntry: Tips;
    let fetchedUserId: string;
    const entryDesc = `Payment of €30 made to Terry Butler for the burial of ${deceasedName}`;
    const entryAmount = 30;
    const name = 'Terry Butler';
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
        newEntry = new Tips(Math.random().toString(), entryDate, entryAmount, entryDesc, name);
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tips.json?auth=${token}`,
          { ...newEntry, id: null }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.tips;
      }),
      take(1),
      tap((tip) => {
        newEntry.id = generateId;
        this._tip.next(tip.concat(newEntry));
      })
    );
  }

  addSacristanPayment(entryDate: Date) {
    let generateId: string;
    let newEntry: Tips;
    let fetchedUserId: string;
    const entryDesc = `Sacristan Payment of €50 made to St. Anne’s Church Sligo`;
    const entryAmount = 50;
    const name = 'St. Anne’s Church';
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
        newEntry = new Tips(Math.random().toString(), entryDate, entryAmount, entryDesc, name);
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tips.json?auth=${token}`,
          { ...newEntry, id: null }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.tips;
      }),
      take(1),
      tap((tip) => {
        newEntry.id = generateId;
        this._tip.next(tip.concat(newEntry));
      })
    );
  }

  addSligoCathedralPayment(entryDate: Date, sacristanName: string) {
    let generateId: string;
    let newEntry: Tips;
    let fetchedUserId: string;
    const entryDesc = `Sacristan Payment of €50 made to ${sacristanName}`;
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
        newEntry = new Tips(Math.random().toString(), entryDate, entryAmount, entryDesc, sacristanName);
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tips.json?auth=${token}`,
          { ...newEntry, id: null }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.tips;
      }),
      take(1),
      tap((tip) => {
        newEntry.id = generateId;
        this._tip.next(tip.concat(newEntry));
      })
    );
  }

  fetchTips() {

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.get<{ [key: string]: TipData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tips.json?auth=${token}`
        )),
      map((resData) => {
        const tips = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            tips.push(new Tips(
              key,
              resData[key].entryDate,
              resData[key].entryAmount,
              resData[key].entryDesc,
              resData[key].payeeName,
              resData[key].paymentDate
              ));
          }
        }
        return tips;
      }),
      tap((tip) => {
        this._tip.next(tip);
      })
    );
  }

  getTips(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.get<TipData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tips/${id}.json?auth=${token}`
        )),
      map((resData) => new Tips(
         id,
         resData.entryDate,
         resData.entryAmount,
         resData.entryDesc,
         resData.payeeName,
         resData.paymentDate
         ))
    );
  }

  updateTips(tipId: string, entryDate: Date, entryAmount: number, entryDesc: string, payeeName: string, paymentDate?: Date) {
    let updateTips: Tips[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.tips;
      }),
      take(1),
      switchMap((tips) => {
        if (!tips || tips.length <= 0) {
          return this.fetchTips();
        } else {
          return of(tips);
        }
      }),
      switchMap((donation) => {
        const updateTipsIndex = donation.findIndex(
          (pl) => pl.id === tipId
        );
        updateTips = [...donation];
        const oldDonation = updateTips[updateTipsIndex];

        updateTips[updateTipsIndex] = new Tips(
          oldDonation.id,
          entryDate,
          entryAmount,
          entryDesc,
          payeeName,
          paymentDate
        );
        return this.http.put<Tips>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tips/${tipId}.json?auth=${fetchedToken}`,
          { ...updateTips[updateTipsIndex], id: null }
        );
      }),
      tap(() => {
        this._tip.next(updateTips);
      })
    );
  }

  deleteTip(tipId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tips/${tipId}.json?auth=${token}`
        )),
      switchMap(() => this.tips),
      take(1),
      tap((tip) => {
        this._tip.next(tip.filter((b) => b.id !== tipId));
      })
    );
  }
}
