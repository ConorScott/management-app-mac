/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Payment } from 'src/app/shared/payment.model';

interface PaymentData {
  id: string;
  paymentDate: Date;
  amount: number;
  paymentMethod: string;
  payeeName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private _payment = new BehaviorSubject<Payment[]>([]);

  get payment() {
    return this._payment.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) { }

  addPayment(payment: Payment, debtorId) {
    let generatedId: string;
    let newPayment: Payment;
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
        newPayment = new Payment(
          debtorId,
          payment.paymentDate,
          payment.amount,
          payment.paymentMethod,
          payment.payeeName
        );
        return this.http
      .post<Payment>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments.json?auth=${token}`,
        { ...newPayment }
      );
      }),switchMap((resData) => {

        return this.payment;
      }),
      take(1),
      tap((payments) => {
        this._payment.next(payments.concat(newPayment));
      })
    );
  }

  updatePayment(
    debtorId: string,
    paymentDate: Date,
    amount: number,
    paymentMethod: string,
    name: string
  ) {
    let updatePayment: Payment[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.payment;
      }),
      take(1),
      switchMap((user) => {
        if (!user || user.length <= 0) {
          return this.fetchPayments(debtorId);
        } else {
          return of(user);
        }
      }),
      switchMap((user) => {
        const updatePaymentIndex = user.findIndex((pl) => pl.id === debtorId);
        updatePayment = [...user];
        const oldUser = updatePayment[updatePaymentIndex];

        updatePayment[updatePaymentIndex] = new Payment(
          oldUser.id,
          paymentDate,
          amount,
          paymentMethod,
          name
        );
        return this.http.put<Payment>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments/${debtorId}.json?auth=${fetchedToken}`,
          { ...updatePayment[updatePaymentIndex], id: null }
        );
      }),
      tap(() => {
        this._payment.next(updatePayment);
      })
    );
  }

  fetchPayments(id: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: PaymentData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments.json?auth=${token}`
      );
    }), map((resData) => {
      const payments = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key) &&
        resData[key].id === id) {
          payments.push(
            new Payment(
              key,
              resData[key].paymentDate,
              resData[key].amount,
              resData[key].paymentMethod,
              resData[key].payeeName
            )
          );
        }
      }
      return payments;
    }),
    tap((payment) => {
      this._payment.next(payment);
    })
    );
  }

  fetchAllPayments() {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: PaymentData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments.json?auth=${token}`
      );
    }), map((resData) => {
      const payments = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          payments.push(
            new Payment(
              key,
              resData[key].paymentDate,
              resData[key].amount,
              resData[key].paymentMethod,
              resData[key].payeeName
            )
          );
        }
      }
      return payments;
    }),
    tap((payment) => {
      this._payment.next(payment);
    })
    );
  }

  fetchCashPayments(method: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: PaymentData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments.json?auth=${token}`
      );
    }), map((resData) => {
      const payments = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key) &&
        resData[key].paymentMethod === method) {
          payments.push(
            new Payment(
              key,
              resData[key].paymentDate,
              resData[key].amount,
              resData[key].paymentMethod,
              resData[key].payeeName
            )
          );
        }
      }
      return payments;
    }),
    tap((payment) => {
      this._payment.next(payment);
    })
    );
  }

  getPayments(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<PaymentData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments/${id}.json?auth=${token}`
        );
      }),
      map((resData) => {
        return new Payment(
          id,
          resData.paymentDate,
          resData.amount,
          resData.paymentMethod,
          resData.payeeName
        );
      })
    );
  }

  deletePayment(paymentId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/payments/${paymentId}.json?auth=${token}`
        );
      }),
      switchMap(() => {
        return this.payment;
      }),
      take(1),
      tap((payment) => {
        this._payment.next(payment.filter((b) => b.id !== paymentId));
      })
    );
  }
}
