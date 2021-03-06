/* eslint-disable arrow-body-style */
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
import { TipPayee } from './tip-payee.model';
import { TipPayments } from './tip-payments.model';
interface TipPaymentData {
  id: string;
  entryDate: Date;
  entryAmount: number;
  entryDesc: string;
  payeeName: string;
  paymentDate: Date;
  payeeId: string;
}

interface TipPayeeData {
  id: string;
  name: string;
  balance: number;
}

@Injectable({
  providedIn: 'root',
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

  constructor(private http: HttpClient, private authService: AuthService, private networkService: NetworkService,
    private offlineManager: OfflineManagerService,
    private storageService: StorageService, private apiService: ApiService) {}

  // addTipPaymentInfo(
  //   entryDate: Date,
  //   entryAmount: number,
  //   entryDesc: string,
  //   payeeName: string,
  //   createdAt: Date,
  //   payeeId: string
  // ) {
  //   console.log(payeeName);
  //   this.checkTipPayees(payeeName).subscribe((tip) => {
  //     if (tip.length > 0) {
  //       tip.map((payee) => {
  //         this.updateTipPaymentInfo(
  //           payee.id,
  //           payee.name,
  //           entryAmount
  //         ).subscribe();
  //         this.addTipPayment(
  //           entryDate,
  //           entryAmount,
  //           entryDesc,
  //           payeeName,
  //           createdAt,
  //           payeeId
  //         ).subscribe();
  //       });
  //     } else {
  //       console.log('success');
  //       this.addTipPayment(
  //         entryDate,
  //         entryAmount,
  //         entryDesc,
  //         payeeName,
  //         createdAt,
  //         payeeId
  //       ).subscribe();
  //     }
  //   });
  // }

  addTipPayment(
    entryDate: Date,
    entryAmount: number,
    entryDesc: string,
    payeeName: string,
    createdAt: Date,
    payeeId: string
  ) {
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
        newEntry = new TipPayments(
          Math.random().toString(),
          createdAt,
          entryAmount,
          entryDesc,
          payeeName,
          entryDate,
          payeeId
        );
        let url =`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayments.json?auth=${token}`;
        let data = {...newEntry, id: null};
        if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
          return from(this.offlineManager.storeRequest(url, 'POST', data));
        } else {
          return this.http.post<{ name: string }>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayments.json?auth=${token}`,
            { ...newEntry, id: null }
          );
        }

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
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('tipPayments'))
    } else {
      return this.authService.token.pipe(
        take(1),
        switchMap((token) =>
          this.http.get<{ [key: string]: TipPaymentData }>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayments.json?auth=${token}`
          )
        ),
        map((resData) => {
          const tips = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              tips.push(
                new TipPayments(
                  key,
                  resData[key].entryDate,
                  resData[key].entryAmount,
                  resData[key].entryDesc,
                  resData[key].payeeName,
                  resData[key].paymentDate,
                  resData[key].payeeId
                )
              );
            }
          }
          return tips;
        }),
        tap((tip) => {
          this.apiService.setLocalData('tipPayments', tip);
          this._tipPayment.next(tip);
        })
      );
    }

  }

  fetchTipPaymentId(payeeId) {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('tipId'))
    } else {
      return this.authService.token.pipe(
        take(1),
        switchMap((token) =>
          this.http.get<{ [key: string]: TipPaymentData }>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayments.json?auth=${token}`
          )
        ),
        map((resData) => {
          const tips = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key) && resData[key].payeeId === payeeId) {
              tips.push(
                new TipPayments(
                  key,
                  resData[key].entryDate,
                  resData[key].entryAmount,
                  resData[key].entryDesc,
                  resData[key].payeeName,
                  resData[key].paymentDate,
                  resData[key].payeeId
                )
              );
            }
          }
          return tips;
        }),
        tap((tip) => {
          this.apiService.setLocalData('tipId', tip);

        })
      );
    }

  }

  getTips(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) =>
        this.http.get<TipPaymentData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayments/${id}.json?auth=${token}`
        )
      ),
      map(
        (resData) =>
          new TipPayments(
            id,
            resData.entryDate,
            resData.entryAmount,
            resData.entryDesc,
            resData.payeeName,
            resData.paymentDate,
            resData.payeeId
          )
      )
    );
  }

  updateTipPayment(
    tipId: string,
    entryDate: Date,
    entryAmount: number,
    entryDesc: string,
    payeeName: string,
    paymentDate: Date,
    payeeId: string
  ) {
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
        const updateTipsIndex = donation.findIndex((pl) => pl.id === tipId);
        updateTips = [...donation];
        const oldDonation = updateTips[updateTipsIndex];

        updateTips[updateTipsIndex] = new TipPayments(
          oldDonation.id,
          entryDate,
          entryAmount,
          entryDesc,
          payeeName,
          paymentDate,
          payeeId
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
      switchMap((token) =>
        this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayments/${tipId}.json?auth=${token}`
        )
      ),
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
    this.checkTipPayees(name).subscribe((tip) => {
      console.log(tip);
      if (tip.length > 0) {
        tip.map((payee) => {
          this.updateTipPayee(payee.id, payee.name, amount).subscribe();
        });
      } else {
        console.log('success');
        this.addTipPayeeInfo(name, amount).subscribe();
      }
    });
  }

  addTipPayeeInfo(name: string, amount: number) {
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
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: TipPayee }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayee.json?auth=${token}`
        );
      }),
      map((resData) => {
        const tips = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key) && resData[key].name === name) {
            tips.push(
              new TipPayee(key, resData[key].name, resData[key].balance)
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
      switchMap((token) =>
        this.http.get<{ [key: string]: TipPayeeData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/tipPayee.json?auth=${token}`
        )
      ),
      map((resData) => {
        const tips = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            tips.push(
              new TipPayee(key, resData[key].name, resData[key].balance)
            );
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
        const updateTipsIndex = donation.findIndex((pl) => pl.id === tipId);
        updateTips = [...donation];
        const oldDonation = updateTips[updateTipsIndex];
        balance = oldDonation.balance + amount;

        updateTips[updateTipsIndex] = new TipPayee(
          oldDonation.id,
          name,
          balance
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
        const updateTipsIndex = donation.findIndex((pl) => pl.id === tipId);
        updateTips = [...donation];
        const oldDonation = updateTips[updateTipsIndex];
        balance = oldDonation.balance - amount;

        updateTips[updateTipsIndex] = new TipPayee(
          oldDonation.id,
          name,
          balance
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
        const updateTipsIndex = donation.findIndex((pl) => pl.id === tipId);
        updateTips = [...donation];
        const oldDonation = updateTips[updateTipsIndex];
        balance = oldDonation.balance - amount;

        updateTips[updateTipsIndex] = new TipPayee(
          oldDonation.id,
          name,
          balance
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
