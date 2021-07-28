/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Coffin } from './coffin.model';

interface CoffinData {
  coffinName: string;
  stockLevel: number;
  stockLocation: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoffinService {

  private _coffin = new BehaviorSubject<Coffin[]>([]);

  get coffin() {
    return this._coffin.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  addCoffin(coffinName: string, stockLevel: number, stockLocation: string) {
    let generateId: string;
    let newCoffin: Coffin;
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
        newCoffin = new Coffin(
          Math.random().toString(),
          coffinName,
          stockLevel,
          stockLocation
        );
        return this.http
        .post<{name: string}>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffins.json?auth=${token}`,
          { ...newCoffin, id: null }
        );
      }),switchMap((resData) => {
        generateId = resData.name;
        return this.coffin;
      }),
      take(1),
      tap((coffin) => {
        newCoffin.id = generateId;
        this._coffin.next(coffin.concat(newCoffin));
      })
    );
  }
  fetchAllCoffins() {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: CoffinData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffins.json?auth=${token}`
      );
    }), map((resData) => {
      const coffin = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          coffin.push(
            new Coffin(
              key,
              resData[key].coffinName,
              resData[key].stockLevel,
              resData[key].stockLocation
            )
          );
        }
      }
      return coffin;
    }),
    tap((coffin) => {
      this._coffin.next(coffin);
    })
    );
  }

  fetchCoffins(formType: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<{ [key: string]: CoffinData }>(
        `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffins.json?auth=${token}`
      );
    }), map((resData) => {
      const coffin = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key) &&
        resData[key].stockLocation === formType) {
          coffin.push(
            new Coffin(
              key,
              resData[key].coffinName,
              resData[key].stockLevel,
              resData[key].stockLocation
            )
          );
        }
      }
      return coffin;
    }),
    tap((coffin) => {
      this._coffin.next(coffin);
    })
    );
  }

  getCoffin(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<CoffinData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffins/${id}.json?auth=${token}`
        );
      }),
      map((resData) => {
        return new Coffin(
          id,
          resData.coffinName,
          resData.stockLevel,
          resData.stockLocation
        );
      })
    );
  }

  getCoffinId(name: string, location: string) {
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
        return this.http.get<{ [key: string]: CoffinData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffins.json?auth=${token}`
        );
      }),
      map((resData) => {
        const coffins = [];
        for(const key in resData){
          if(resData.hasOwnProperty(key) &&
          resData[key].coffinName === name
          && resData[key].stockLocation === location){
            coffins.push(
              new Coffin(
                key,
                resData[key].coffinName,
                resData[key].stockLevel,
                resData[key].stockLocation
              )
            );
          }
        }
        return coffins;
      })
    );
  }

  updateCoffin(coffinId: string, coffinName: string, stockLevel: number, stockLocation: string) {
    let updateCoffin: Coffin[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.coffin;
      }),
      take(1),
      switchMap((coffin) => {
        if (!coffin || coffin.length <= 0) {
          const formtype = 'sligo';
          return this.fetchCoffins(formtype);
        } else {
          return of(coffin);
        }
      }),
      switchMap((coffin) => {
        const updateCoffinIndex = coffin.findIndex((pl) => pl.id === coffinId);
        updateCoffin = [...coffin];
        const oldCoffin = updateCoffin[updateCoffinIndex];

        updateCoffin[updateCoffinIndex] = new Coffin(
          oldCoffin.id,
          coffinName,
          stockLevel,
          stockLocation
        );
        return this.http.put<Coffin>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffins/${coffinId}.json?auth=${fetchedToken}`,
          { ...updateCoffin[updateCoffinIndex], id: null }
        );
      }),
      tap(() => {
        this._coffin.next(updateCoffin);
      })
    );
  }

  updateCoffins(coffinId: string, coffinName: string, stockLevel: number, stockLocation: string) {
    let updateCoffin: Coffin[];
    let fetchedToken: string;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.coffin;
      }),
      take(1),
      switchMap((coffin) => {
        if (!coffin || coffin.length <= 0) {
          const formtype = 'sligo';
          return this.fetchCoffins(formtype);
        } else {
          return of(coffin);
        }
      }),
      switchMap((coffin) => {
        const updateCoffinIndex = coffin.findIndex((pl) => pl.id === coffinId);
        updateCoffin = [...coffin];
        const oldCoffin = updateCoffin[updateCoffinIndex];
        const newStockLevel = stockLevel - 1;
        updateCoffin[updateCoffinIndex] = new Coffin(
          oldCoffin.id,
          coffinName,
          newStockLevel,
          oldCoffin.stockLocation
        );
        return this.http.put<Coffin>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffins/${coffinId}.json?auth=${fetchedToken}`,
          { ...updateCoffin[updateCoffinIndex], id: null }
        );
      }),
      tap(() => {
        this._coffin.next(updateCoffin);
      })
    );
  }

  updateAddCoffin(coffinId: string, coffinName: string, stockLevel: number, stockLocation: string) {
    let updateCoffin: Coffin[];
    let fetchedToken: string;
    console.log(coffinId);
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.coffin;
      }),
      take(1),
      switchMap((coffin) => {
        if (!coffin || coffin.length <= 0) {
          return this.fetchCoffins(stockLocation);
        } else {
          return of(coffin);
        }
      }),
      switchMap((coffin) => {
        const updateCoffinIndex = coffin.findIndex((pl) => pl.id === coffinId);
        updateCoffin = [...coffin];
        const oldCoffin = updateCoffin[updateCoffinIndex];
        const newStockLevel = stockLevel + 1;
        updateCoffin[updateCoffinIndex] = new Coffin(
          oldCoffin.id,
          coffinName,
          newStockLevel,
          oldCoffin.stockLocation
        );
        return this.http.put<Coffin>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffins/${coffinId}.json?auth=${fetchedToken}`,
          { ...updateCoffin[updateCoffinIndex], id: null }
        );
      }),
      tap(() => {
        this._coffin.next(updateCoffin);
      })
    );
  }

  deleteCoffin(coffinId: string){
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http.delete(`https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffins/${coffinId}.json?auth=${token}`
      );
    }),
    switchMap(() => {
      return this.coffin;
    }),
    take(1),
     tap(coffin => {
      this._coffin.next(coffin.filter((b) => b.id !== coffinId));
    }));
  }
}
