/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { TipPayments } from './tip-payments.model';
interface TipPaymentData {
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
export class TipPaymentsService {
  private _tipPayment = new BehaviorSubject<TipPayments[]>([]);

  get tipPayment() {
    return this._tipPayment.asObservable();
  }


  constructor(private http: HttpClient, private authService: AuthService) { }

  addTipPayment(entryDate: Date, entryAmount: number, entryDesc: string, payeeName: string, createdAt: Date) {
    let generateId: string;
    let newEntry: TipPayments;
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
        newEntry = new TipPayments(Math.random().toString(), createdAt, entryAmount, entryDesc, payeeName, entryDate);
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayments.json?auth=${token}`,
          { ...newEntry, id: null }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.tipPayment;
      }),
      take(1),
      tap((tips) => {
        newEntry.id = generateId;
        this._tipPayment.next(tips.concat(newEntry));
      })
    );
  }

  fetchTipPayments() {

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.get<{ [key: string]: TipPaymentData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayments.json?auth=${token}`
        )),
      map((resData) => {
        const tips = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            tips.push(new TipPayments(
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
        this._tipPayment.next(tip);
      })
    );
  }

  getTips(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.get<TipPaymentData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayments/${id}.json?auth=${token}`
        )),
      map((resData) => new TipPayments(
         id,
         resData.entryDate,
         resData.entryAmount,
         resData.entryDesc,
         resData.payeeName,
         resData.paymentDate
         ))
    );
  }

  updateTipPayment(tipId: string, entryDate: Date, entryAmount: number, entryDesc: string, payeeName: string, paymentDate?: Date) {
    let updateTips: TipPayments[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.tipPayment;
      }),
      take(1),
      switchMap((tips) => {
        if (!tips || tips.length <= 0) {
          return this.fetchTipPayments();
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

        updateTips[updateTipsIndex] = new TipPayments(
          oldDonation.id,
          entryDate,
          entryAmount,
          entryDesc,
          payeeName,
          paymentDate
        );
        return this.http.put<TipPayments>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayments/${tipId}.json?auth=${fetchedToken}`,
          { ...updateTips[updateTipsIndex], id: null }
        );
      }),
      tap(() => {
        this._tipPayment.next(updateTips);
      })
    );
  }

  deleteTipPayment(tipId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayments/${tipId}.json?auth=${token}`
        )),
      switchMap(() => this.tipPayment),
      take(1),
      tap((tip) => {
        this._tipPayment.next(tip.filter((b) => b.id !== tipId));
      })
    );
  }
}


