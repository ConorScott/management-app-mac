/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Receipt } from './receipt.model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File, IWriteOptions } from '@ionic-native/file/ngx';

import { Printer } from '@ionic-native/printer/ngx';
import { times } from 'src/fonts/times-normal.Base64.encoded';
import { timesBold } from 'src/fonts/times-bold.Base64.encoded';
import { helvetica } from 'src/fonts/helvetica-normal.Base64.encoded';
import { helveticaBold } from 'src/fonts/helvetica-bold.Base64.encoded';
import { ConnectionStatus, NetworkService } from 'src/app/services/network.service';
import { OfflineManagerService } from 'src/app/services/offline-manager.service';
import { StorageService } from 'src/app/services/storage-service.service';
import { ApiService } from 'src/app/services/api.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


interface ReceiptData {
 id: string;
 paymentId: string;
 paymentDate: Date;
 amount: number;
 paymentMethod: string;
 payeeName: string;
 receiptDate: Date;
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


  constructor(private http: HttpClient, private authService: AuthService, private _decimalPipe: DecimalPipe, private file: File,
    private fileOpener: FileOpener,
    public printer: Printer,  private networkService: NetworkService,
    private offlineManager: OfflineManagerService,
    private storageService: StorageService, private apiService: ApiService) { }

  addReceipt(receipt: Receipt, debtorId) {
    console.log(debtorId);
    let generatedId: string;
    let newReceipt: Receipt;
    let fetchedUserId: string;
    let receiptDate = new Date();
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
          receipt.payeeName,
          receiptDate
        );
        let url =`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts.json?auth=${token}`;
        let data = {...newReceipt, id: null};
        if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
          return from(this.offlineManager.storeRequest(url, 'POST', data));
        } else {
          return this.http
          .post<{name: string}>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts.json?auth=${token}`,
            { ...newReceipt, id:null}
          );
        }

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
  addDebtorReceipt(receipt: Receipt, debtorId) {
    console.log(debtorId);
    let generatedId: string;
    let newReceipt: Receipt;
    let fetchedUserId: string;
    let receiptDate = new Date();
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
          receipt.payeeName,
          receiptDate
        );
        let url =`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts.json?auth=${token}`;
        let data = {...newReceipt, id: null};
        if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
          return from(this.offlineManager.storeRequest(url, 'POST', data));
        } else {
          return this.http
          .post<{name: string}>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts.json?auth=${token}`,
            { ...newReceipt, id:null}
          );
        }

      }),switchMap((resData) => {
        generatedId = resData.name;
        return this.receipts;
      }),
      take(1),
      tap((receipts) => {
        newReceipt.id = generatedId;
        this._receipts.next(receipts.concat(newReceipt));
      })
    );
  }

  addReceiptEntry(paymentDate: Date, amount: number, paymentMethod: string, payeeName: string, receiptDate: Date) {
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
          Math.random().toString(),
         paymentDate,
         amount,
         paymentMethod,
         payeeName,
         receiptDate
        );
        let url =`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts.json?auth=${token}`;
        let data = {...newReceipt, id: null};
        if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
          return from(this.offlineManager.storeRequest(url, 'POST', data));
        } else {
          return this.http
          .post<{name: string}>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/receipts.json?auth=${token}`,
            { ...newReceipt, id:null}
          );
        }

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
    name: string,
    receiptDate: Date
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
          name,
          receiptDate
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
    name: string,
    receiptDate
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
          return this.fetchAllPayments();
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
          name,
          receiptDate
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
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('receipts'))
    } else {
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
                resData[key].payeeName,
                resData[key].receiptDate
              )
            );
          }
        }
        return receipts.reverse();
      }),
      tap((receipt) => {
        this.apiService.setLocalData('receipts', receipt);
        this._receipts.next(receipt);
      })
      );
    }

  }

  fetchAllPayments() {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('allReceipts'))
    } else {
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
                resData[key].payeeName,
                resData[key].receiptDate
              )
            );
          }
        }
        return receipts.reverse();
      }),
      tap((receipt) => {
        this.apiService.setLocalData('allReceipts', receipt);
        this._receipt.next(receipt);
      })
      );
    }

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
         resData.payeeName,
         resData.receiptDate
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

  onGenerateReceipt(receipt:Receipt){
    let action = "open"
    let receiptAmount = this._decimalPipe.transform(receipt.amount, '1.2-2');
    let receiptDate: string;

    if(!receipt.receiptDate){
      let date = new Date();
    receiptDate = new DatePipe('en-US').transform(
      date,
      'dd/MM/yyyy'
    );
    } else {
    receiptDate = new DatePipe('en-US').transform(
      receipt.receiptDate,
      'dd/MM/yyyy'
    );
    }

    const paymentDate = new DatePipe('en-US').transform(
      receipt.paymentDate,
      'dd/MM/yyyy'
    );
    pdfFonts.pdfMake.vfs['times_b64']=times;
    pdfFonts.pdfMake.vfs['timesBold_b64']=timesBold;
    pdfFonts.pdfMake.vfs['Helvetica_b64']=helvetica;
    pdfFonts.pdfMake.vfs['Helvetica-Bold_b64']=helveticaBold;
    // pdfFonts.pdfMake.vfs['helveticaBold_b64']=timesBold

    pdfMake.fonts = {
      courier: {
        normal: 'Courier',
        bold: 'Courier-Bold',
        italics: 'Courier-Oblique',
        bolditalics: 'Courier-BoldOblique',
      },
      Helvetica: {
        normal: 'Helvetica_b64',
        bold: 'Helvetica-Bold_b64',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Times: {
        normal: 'times_b64',
        bold: 'timesBold_b64',
        italics: 'times_b64',
        bolditalics: 'times_b64',
      },
      symbol: {
        normal: 'Symbol',
      },
      zapfDingbats: {
        normal: 'ZapfDingbats',
      },
    };


    // this.modal.dismiss(
    //   {
    //     receiptData: {

    //       receipt: this.receipt
    //     }
    //   },
    //   'confirm'
    // );
    // this.child.printDiv1(div);

    const doc = {
      content: [
        {
          columns: [
            {
            text: `Receipt`,
            alignment: 'left',
            fontSize: 42,
            },
            {
              text: `${receiptDate}`,
              margin: [0, 20, 0, 0],
              alignment: 'left',
              fontSize: 14
            }
          ]

        },
        {
          columns: [
            {
              text: `Payee Name:`,
              margin: [22.5, 40, 0, 20],
              bold: true,
              alignment: 'left',
              fontSize: 14,
            },
            {
              text: `${receipt.payeeName}`,
              alignment: 'left',
              margin: [0, 40, 0, 20],
              fontSize: 14,
            }
          ],
        },
        {
          columns: [
            {
              text: `Payment Date:`,
              bold: true,
              alignment: 'left',
              margin: [22.5, 0, 0, 20],
              fontSize: 14,
            },
            {
              text: `${paymentDate}`,
              alignment: 'left',
              margin: [0, 0, 0, 20],
              fontSize: 14,
            }
          ],
        },
        {
          columns: [
            {
              text: `Payment Amount:`,
              bold: true,
              alignment: 'left',
              margin: [22.5, 0, 0, 20],
              fontSize: 14,
            },
            {
              text: `€${receiptAmount}`,
              alignment: 'left',
              margin: [0, 0, 0, 20],
              fontSize: 14,
            }
          ],
        },
        {
          columns: [
            {
              text: `Payment Method:`,
              bold: true,
              alignment: 'left',
              margin: [22.5, 0, 0, 20],
              fontSize: 14,
            },
            {
              text: `${receipt.paymentMethod}`,
              alignment: 'left',
              margin: [0, 0, 0, 20],
              fontSize: 14,
            }
          ],
        },
        {
          columns: [
            {
              text: `Received with thanks`,
              bold: true,
              alignment: 'left',
              margin: [30, 10, 0, 20],
              fontSize: 14,
            },
          ],
        },
        {
          columns: [
            {
              text: `Signed:`,
              bold: true,
              alignment: 'left',
              margin: [30, 0, 0, 20],
              fontSize: 14,
            },
          ],
        },

    ],
    defaultStyle: {
      font: 'Helvetica'
    },
    pageMargins: [100, 250, 50, 0]
    }

    if(this.isElectron()){

        pdfMake.createPdf(doc).open();

    } else {
      this.printDiv(doc);
    }
  }

  printDiv(div) {
    // const printContents = document.getElementById(div).innerHTML;
    //  const originalContents = document.body.innerHTML;
    //  document.body.innerHTML = printContents;
    //  window.print();
    //  document.body.innerHTML = originalContents;
    const pdfObj = pdfMake.createPdf(div);
    pdfObj.getBuffer(async (buffer) => {
      const blob = new Blob([buffer], { type: 'application/pdf' });
        const fileName = 'someNameHere.pdf';
        await this.file.writeFile(this.file.dataDirectory, fileName, blob, { replace: true });
        await this.printer.print(this.file.dataDirectory + fileName);
    });
  }

  isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}
}
