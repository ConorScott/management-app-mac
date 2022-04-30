/* eslint-disable max-len */
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
import { CoffinSale } from './coffin.model';

interface CoffinSaleData {
  id: string;
  coffinSaleDate: Date;
  coffinName: string;
  stockLocation: string;
  amount: number;
  deceasedName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoffinSalesService {

  private _coffinSale = new BehaviorSubject<CoffinSale[]>([]);

  get coffinSale() {
    return this._coffinSale.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService, private networkService: NetworkService,
    private offlineManager: OfflineManagerService,
    private storageService: StorageService, private apiService: ApiService) {}


  addCoffinSale(coffinSaleDate: Date, coffinName: string, stockLocation: string, amount: number, deceasedName: string) {
    let generateId: string;
    let newCoffinSale: CoffinSale;
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
        newCoffinSale = new CoffinSale(
          Math.random().toString(),
          coffinSaleDate,
          coffinName,
          stockLocation,
          amount,
          deceasedName
        );
        let url =`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffinSales.json?auth=${token}`;
        let data = {...newCoffinSale, id: null};
        if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
          return from(this.offlineManager.storeRequest(url, 'POST', data));
        } else {
          return this.http
          .post<{name: string}>(
            `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffinSales.json?auth=${token}`,
            { ...newCoffinSale, id: null }
          );
        }

      }),switchMap((resData) => {
        generateId = resData.name;
        return this.coffinSale;
      }),
      take(1),
      tap((coffinSale) => {
        newCoffinSale.id = generateId;
        this._coffinSale.next(coffinSale.concat(newCoffinSale));
      })
    );
  }
  fetchAllCoffinSales() {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('allCoffinSales'))
    } else {
      return this.authService.token.pipe(take(1), switchMap(token => {
        return this.http
        .get<{ [key: string]: CoffinSaleData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffinSales.json?auth=${token}`
        );
      }), map((resData) => {
        const coffin = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            coffin.push(
              new CoffinSale(
                key,
                resData[key].coffinSaleDate,
                resData[key].coffinName,
                resData[key].stockLocation,
                resData[key].amount,
                resData[key].deceasedName,
              )
            );
          }
        }
        return coffin.reverse();
      }),
      tap((coffin) => {
        this.apiService.setLocalData('allCoffinSales', coffin);
        this._coffinSale.next(coffin);
      })
      );
    }

  }

  fetchCoffinSales(formType: string) {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.apiService.getLocalData('coffinSales'))
    } else {
      return this.authService.token.pipe(take(1), switchMap(token => {
        return this.http
        .get<{ [key: string]: CoffinSaleData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffinSales.json?auth=${token}`
        );
      }), map((resData) => {
        const coffin = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key) &&
          resData[key].coffinName === formType) {
            coffin.push(
              new CoffinSale(
                key,
                resData[key].coffinSaleDate,
                resData[key].coffinName,
                resData[key].stockLocation,
                resData[key].amount,
                resData[key].deceasedName,
              )
            );
          }
        }
        return coffin.reverse();
      }),
      tap((coffin) => {
        this.apiService.setLocalData('coffinSales', coffin);
        this._coffinSale.next(coffin);
      })
      );
    }

  }

  getCoffinSale(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<CoffinSaleData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffinSales/${id}.json?auth=${token}`
        );
      }),
      map((resData) => {
        return new CoffinSale(
          id,
          resData.coffinSaleDate,
          resData.coffinName,
          resData.stockLocation,
          resData.amount,
          resData.deceasedName
        );
      })
    );
  }

  getCoffinSalesId(name: string, location: string) {
    console.log(name);
    console.log(location);
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('USer not found!');
        }
        fetchedUserId = userId;
        console.log(fetchedUserId);
        return this.authService.token;

      }),
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: CoffinSale }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffinSales.json?auth=${token}`
        );
      }),
      map((resData) => {
        const coffins = [];
        for(const key in resData){
          if(resData.hasOwnProperty(key) &&
          resData[key].coffinName === name
          && resData[key].deceasedName === location){
            coffins.push(
              new CoffinSale(
                key,
              resData[key].coffinSaleDate,
              resData[key].coffinName,
              resData[key].stockLocation,
              resData[key].amount,
              resData[key].deceasedName,
              )
            );
          }
        }
        return coffins.reverse();
      })
    );
  }

  updateCoffin(coffinSaleId: string, coffinSaleDate: Date, coffinName: string, stockLocation: string, amount: number, deceasedName: string) {
    let updateCoffin: CoffinSale[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.coffinSale;
      }),
      take(1),
      switchMap((coffin) => {
        if (!coffin || coffin.length <= 0) {
          const formtype = 'sligo';
          return this.fetchCoffinSales(formtype);
        } else {
          return of(coffin);
        }
      }),
      switchMap((coffin) => {
        const updateCoffinIndex = coffin.findIndex((pl) => pl.id === coffinSaleId);
        updateCoffin = [...coffin];
        const oldCoffin = updateCoffin[updateCoffinIndex];

        updateCoffin[updateCoffinIndex] = new CoffinSale(
          oldCoffin.id,
          coffinSaleDate,
          coffinName,
          stockLocation,
          amount,
          deceasedName
        );
        return this.http.put<CoffinSale>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffinSales/${coffinSaleId}.json?auth=${fetchedToken}`,
          { ...updateCoffin[updateCoffinIndex], id: null }
        );
      }),
      tap(() => {
        this._coffinSale.next(updateCoffin);
      })
    );
  }

  // updateCoffins(coffinId: string, coffinName: string, stockLevel: number) {
  //   let updateCoffin: Coffin[];
  //   let fetchedToken: string;
  //   return this.authService.token.pipe(
  //     take(1),
  //     switchMap((token) => {
  //       fetchedToken = token;
  //       return this.coffin;
  //     }),
  //     take(1),
  //     switchMap((coffin) => {
  //       if (!coffin || coffin.length <= 0) {
  //         const formtype = 'sligo';
  //         return this.fetchCoffins(formtype);
  //       } else {
  //         return of(coffin);
  //       }
  //     }),
  //     switchMap((coffin) => {
  //       const updateCoffinIndex = coffin.findIndex((pl) => pl.id === coffinId);
  //       updateCoffin = [...coffin];
  //       const oldCoffin = updateCoffin[updateCoffinIndex];
  //       const newStockLevel = stockLevel - 1;
  //       updateCoffin[updateCoffinIndex] = new Coffin(
  //         oldCoffin.id,
  //         coffinName,
  //         newStockLevel,
  //         oldCoffin.stockLocation
  //       );
  //       return this.http.put<Coffin>(
  //         `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffinSales/${coffinId}.json?auth=${fetchedToken}`,
  //         { ...updateCoffin[updateCoffinIndex], id: null }
  //       );
  //     }),
  //     tap(() => {
  //       this._coffin.next(updateCoffin);
  //     })
  //   );
  // }

  deleteCoffinSale(coffinSaleId: string){
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http.delete(`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffinSales/${coffinSaleId}.json?auth=${token}`
      );
    }),
    switchMap(() => {
      return this.coffinSale;
    }),
    take(1),
     tap(coffin => {
      this._coffinSale.next(coffin.filter((b) => b.id !== coffinSaleId));
    }));
  }
}
