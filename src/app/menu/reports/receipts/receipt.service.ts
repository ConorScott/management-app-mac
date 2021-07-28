/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Receipt } from './receipt.model';

interface ReceiptData {
 id: string;
 paymentId: string;
 paymentDate: Date;
 amount: number;
 paymentMethod: string;
 payeeName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private _receipt = new BehaviorSubject<Receipt[]>([]);
  private _receipts = new BehaviorSubject<Receipt[]>([]);

  get receipt() {
    return this._receipt.asObservable();
  }
  get receipts() {
    return this._receipts.asObservable();
  }


  constructor(private http: HttpClient, private authService: AuthService) { }

  addReceipt(receipt: Receipt, debtorId) {
    console.log(debtorId);
    let generatedId: string;
    let newReceipt: Receipt;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No User Id Found');
        }
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        newReceipt = new Receipt(
          Math.random().toString(),
          debtorId,
          receipt.paymentDate,
          receipt.amount,
          receipt.paymentMethod,
          receipt.payeeName
        );
        return this.http
      .post<{name: string}>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts.json?auth=${token}`,
        { ...newReceipt, id:null}
      );
      }),switchMap((resData) => {
        generatedId = resData.name;
        return this.receipt;
      }),
      take(1),
      tap((receipts) => {
        newReceipt.id = generatedId;
        this._receipt.next(receipts.concat(newReceipt));
      })
    );
  }

  updateReceipt(
    debtorId: string,
    paymentDate: Date,
    amount: number,
    paymentMethod: string,
    name: string
  ) {
    let updateReceipt: Receipt[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.receipt;
      }),
      take(1),
      switchMap((user) => {
        if (!user || user.length <= 0) {
          return this.fetchReceipts(debtorId);
        } else {
          return of(user);
        }
      }),
      switchMap((user) => {
        const updateReceiptIndex = user.findIndex((pl) => pl.id === debtorId);
        updateReceipt = [...user];
        const oldReceipt = updateReceipt[updateReceiptIndex];

        updateReceipt[updateReceiptIndex] = new Receipt(
          oldReceipt.id,
          oldReceipt.paymentId,
          paymentDate,
          amount,
          paymentMethod,
          name
        );
        return this.http.put<Receipt>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts/${debtorId}.json?auth=${fetchedToken}`,
          { ...updateReceipt[updateReceiptIndex], id: null }
        );
      }),
      tap(() => {
        this._receipt.next(updateReceipt);
      })
    );
  }

  updateReceipts(
    debtorId: string,
    paymentDate: Date,
    amount: number,
    paymentMethod: string,
    name: string
  ) {
    let updateReceipt: Receipt[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.receipts;
      }),
      take(1),
      switchMap((user) => {
        if (!user || user.length <= 0) {
          return this.fetchReceipts(debtorId);
        } else {
          return of(user);
        }
      }),
      switchMap((user) => {
        const updateReceiptIndex = user.findIndex((pl) => pl.id === debtorId);
        updateReceipt = [...user];
        const oldReceipt = updateReceipt[updateReceiptIndex];

        updateReceipt[updateReceiptIndex] = new Receipt(
          oldReceipt.id,
          oldReceipt.paymentId,
          paymentDate,
          amount,
          paymentMethod,
          name
        );
        return this.http.put<Receipt>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts/${debtorId}.json?auth=${fetchedToken}`,
          { ...updateReceipt[updateReceiptIndex], id: null }
        );
      }),
      tap(() => {
        this._receipts.next(updateReceipt);
      })
    );
  }

  fetchReceipts(id: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: ReceiptData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts.json?auth=${token}`
      );
    }), map((resData) => {
      const receipts = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key) &&
        resData[key].paymentId === id) {
          receipts.push(
            new Receipt(
              key,
              resData[key].paymentId,
              resData[key].paymentDate,
              resData[key].amount,
              resData[key].paymentMethod,
              resData[key].payeeName
            )
          );
        }
      }
      return receipts.reverse();
    }),
    tap((receipt) => {
      this._receipts.next(receipt);
    })
    );
  }

  fetchAllPayments() {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: ReceiptData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts.json?auth=${token}`
      );
    }), map((resData) => {
      const receipts = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          receipts.push(
            new Receipt(
              key,
              resData[key].paymentId,
              resData[key].paymentDate,
              resData[key].amount,
              resData[key].paymentMethod,
              resData[key].payeeName
            )
          );
        }
      }
      return receipts;
    }),
    tap((receipt) => {
      this._receipt.next(receipt);
    })
    );
  }

  getDonations(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.get<ReceiptData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts/${id}.json?auth=${token}`
        )),
      map((resData) => new Receipt(
         id,
         resData.paymentId,
         resData.paymentDate,
         resData.amount,
         resData.paymentMethod,
         resData.payeeName
         ))
    );
  }

  deleteReceipt(receiptId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts/${receiptId}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.receipt;
      }),
      take(1),
      tap((receipt) => {
        this._receipt.next(receipt.filter((b) => b.id !== receiptId));
      })
    );
  }

  deleteReceipts(receiptId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts/${receiptId}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.receipts;
      }),
      take(1),
      tap((receipt) => {
        this._receipts.next(receipt.filter((b) => b.id !== receiptId));
      })
    );
  }
}
