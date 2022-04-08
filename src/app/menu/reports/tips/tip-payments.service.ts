/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { TipPayee } from './tip-payee.model';
import { TipPayments } from './tip-payments.model';
interface TipPaymentData {
  id: string;
  entryDate: Date;
  entryAmount: number;
  entryDesc: string;
  payeeName: string;
  paymentDate?: Date;
 }

 interface TipPayeeData {
  id: string;
  name: string;
  balance: number;
 }

@Injectable({
  providedIn: 'root'
})
export class TipPaymentsService {
  private _tipPayment = new BehaviorSubject<TipPayments[]>([]);

  get tipPayment() {
    return this._tipPayment.asObservable();
  }

  private _tipPayee = new BehaviorSubject<TipPayee[]>([]);

  get tipPayee() {
    return this._tipPayee.asObservable();
  }


  constructor(private http: HttpClient, private authService: AuthService) { }

  addTipPaymentInfo(entryDate: Date, entryAmount: number, entryDesc: string, payeeName: string, createdAt: Date){
    console.log(payeeName);
    this.checkTipPayees(payeeName).subscribe(tip => {

      if(tip.length > 0){
        tip.map(payee => {
        this.updateTipPaymentInfo(payee.id, payee.name, entryAmount).subscribe();
        this.addTipPayment(entryDate, entryAmount, entryDesc, payeeName, createdAt).subscribe();
        });
      } else {
        console.log('success');
        this.addTipPayment(entryDate, entryAmount, entryDesc, payeeName, createdAt).subscribe();
      }
    });
  }

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
    this.getTips(tipId).subscribe((tip) => {
      this.checkTipPayees(tip.payeeName).subscribe(payee => {
        payee.map(tipPayeeInfo => {
          this.updateTipPayee(tipPayeeInfo.id, tipPayeeInfo.name, tip.entryAmount).subscribe();
        });

      });

    });
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

  addTipPayee(name: string, amount: number) {
    let balance: number;
    // eslint-disable-next-line prefer-const
    balance += amount;
    this.checkTipPayees(name).subscribe(tip => {
      console.log(tip);
      if(tip.length > 0){
        tip.map(payee => {
        this.updateTipPayee(payee.id, payee.name, amount).subscribe();
        });
      } else {
        console.log('success');
        this.addTipPayeeInfo(name, amount).subscribe();
      }
    });
  }

  addTipPayeeInfo(name: string, amount: number){
    let generateId: string;
    let newEntry: TipPayee;
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
        newEntry = new TipPayee(Math.random().toString(), name, amount);
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayee.json?auth=${token}`,
          { ...newEntry, id: null }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.tipPayee;
      }),
      take(1),
      tap((tips) => {
        newEntry.id = generateId;
        this._tipPayee.next(tips.concat(newEntry));
      })
    );
  }

  checkTipPayees(name: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: TipPayee }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayee.json?auth=${token}`
      );
    }), map((resData) => {
      const tips = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key) &&
        resData[key].name === name) {
          tips.push(
            new TipPayee(
              key,
              resData[key].name,
              resData[key].balance,
            )
          );

        }
      }
      return tips;
    }),
    tap((tips) => {
      this._tipPayee.next(tips);
    })
    );
  }

  fetchTipPayee() {

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.get<{ [key: string]: TipPayeeData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayee.json?auth=${token}`
        )),
      map((resData) => {
        const tips = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            tips.push(new TipPayee(
              key,
              resData[key].name,
              resData[key].balance,
              ));
          }
        }
        return tips;
      }),
      tap((tip) => {
        this._tipPayee.next(tip);
      })
    );
  }

  updateTipPayee(tipId: string, name: string, amount: number) {
    let updateTips: TipPayee[];
    let fetchedToken: string;
    let balance: number;
    // eslint-disable-next-line prefer-const

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.tipPayee;
      }),
      take(1),
      switchMap((tips) => {
        if (!tips || tips.length <= 0) {
          return this.fetchTipPayee();
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
        balance = oldDonation.balance + amount;

        updateTips[updateTipsIndex] = new TipPayee(
          oldDonation.id,
          name,
          balance,
        );
        return this.http.put<TipPayee>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayee/${tipId}.json?auth=${fetchedToken}`,
          { ...updateTips[updateTipsIndex], id: null }
        );
      }),
      tap(() => {
        this._tipPayee.next(updateTips);
      })
    );
  }
  updateTipPayeeBalance(tipId: string, name: string, amount: number) {
    let updateTips: TipPayee[];
    let fetchedToken: string;
    let balance: number;
    // eslint-disable-next-line prefer-const

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.tipPayee;
      }),
      take(1),
      switchMap((tips) => {
        if (!tips || tips.length <= 0) {
          return this.fetchTipPayee();
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
        balance = oldDonation.balance - amount;

        updateTips[updateTipsIndex] = new TipPayee(
          oldDonation.id,
          name,
          balance,
        );
        return this.http.put<TipPayee>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayee/${tipId}.json?auth=${fetchedToken}`,
          { ...updateTips[updateTipsIndex], id: null }
        );
      }),
      tap(() => {
        this._tipPayee.next(updateTips);
      })
    );
  }

  updateTipPaymentInfo(tipId: string, name: string, amount: number) {
    let updateTips: TipPayee[];
    let fetchedToken: string;
    let balance: number;
    // eslint-disable-next-line prefer-const

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.tipPayee;
      }),
      take(1),
      switchMap((tips) => {
        if (!tips || tips.length <= 0) {
          return this.fetchTipPayee();
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
        balance = oldDonation.balance - amount;

        updateTips[updateTipsIndex] = new TipPayee(
          oldDonation.id,
          name,
          balance,
        );
        return this.http.put<TipPayee>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayee/${tipId}.json?auth=${fetchedToken}`,
          { ...updateTips[updateTipsIndex], id: null }
        );
      }),
      tap(() => {
        this._tipPayee.next(updateTips);
      })
    );
  }

}
