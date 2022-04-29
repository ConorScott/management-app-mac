/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
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
  private _coffinBallina = new BehaviorSubject<Coffin[]>([]);

  get coffin() {
    return this._coffin.asObservable();
  }

  get coffinBallina() {
    return this._coffinBallina.asObservable();
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

  addCoffinBallina(coffinName: string, stockLevel: number, stockLocation: string) {
    let generateId: string;
    let newCoffin: Coffin;
    let fetchedUserId: string;
    console.log('coffin-ballina')
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
        return this.coffinBallina;
      }),
      take(1),
      tap((coffin) => {
        newCoffin.id = generateId;
        this._coffinBallina.next(coffin.concat(newCoffin));
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

  fetchCoffinsBallina(formType: string) {
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
      this._coffinBallina.next(coffin);
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

  // updateCoffin(coffinId: string, coffinName: string, stockLevel: number, stockLocation: string) {
  //   let updateCoffin: Coffin[];
  //   let fetchedToken: string;
  //   let subject: Observable<Coffin[]>;
  //   let formtype: string;

  //   if(stockLocation === 'ballina'){
  //     subject = this.coffin;
  //     formtype = 'sligo';
  //   } else if(stockLocation === 'sligo'){
  //     subject = this.coffinBallina;
  //     formtype = 'ballina';
  //   }
  //   console.log('oldCoffin.id');

  //       console.log(coffinId);
  //   return this.authService.token.pipe(
  //     take(1),
  //     switchMap((token) => {
  //       fetchedToken = token;
  //       return subject;
  //     }),
  //     take(1),
  //     switchMap((coffin) => {
  //       if (!coffin || coffin.length <= 0) {
  //         console.log('error');

  //         return this.fetchCoffins(formtype);
  //       } else {
  //         return of(coffin);
  //       }
  //     }),
  //     switchMap((coffin) => {
  //       console.log(coffin);
  //       const updateCoffinIndex = coffin.findIndex((pl) => pl.id === coffinId);
  //       updateCoffin = [...coffin];
  //       const oldCoffin = updateCoffin[updateCoffinIndex];
  //       console.log('oldCoffin.id');

  //       console.log(oldCoffin.id);

  //       updateCoffin[updateCoffinIndex] = new Coffin(
  //         oldCoffin.id,
  //         coffinName,
  //         stockLevel,
  //         stockLocation
  //       );

  //        if(stockLocation === 'sligo'){
  //         console.log('res.stockLocation ballina');

  //         console.log(stockLocation);
  //         this._coffinBallina.next(coffin.concat(updateCoffin));
  //       } else if(stockLocation === 'ballina') {
  //         console.log('res.stockLocation sligo');

  //         this._coffin.next(coffin.concat(updateCoffin));
  //         console.log(stockLocation);

  //       }

  //       return this.http.put<Coffin>(
  //         `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffins/${coffinId}.json?auth=${fetchedToken}`,
  //         { ...updateCoffin[updateCoffinIndex], id: null }
  //       );
  //     }),
  //     tap((res) => {
  //       // if(res.stockLocation === 'ballina'){
  //       //   console.log('res.stockLocation ballina');

  //       //   console.log(res.stockLocation);
  //       //   this._coffinBallina.next(updateCoffin);
  //       // } else if(res.stockLocation === 'sligo') {
  //       //   console.log('res.stockLocation sligo');

  //       //   this._coffin.next(updateCoffin);
  //       //   console.log(res.stockLocation);

  //       // }
  //     })
  //   );
  // }
  updateCoffin(coffinId: string, coffinName: string, stockLevel: number, stockLocation: string, oldLocation: string) {
    let updateCoffin: Coffin[];
    let fetchedToken: string;
    let subject: Observable<Coffin[]>;
    let formtype: string;
    console.log('oldLocation');

    console.log(oldLocation);

    // if(stockLocation === 'ballina' && oldLocation === 'sligo'){
    //   console.log('oldLocation != ballina');

    //   subject = this.coffin;
    //   formtype = 'sligo';
    // } else if(stockLocation === 'ballina' && oldLocation === 'ballina'){
    //   subject = this.coffinBallina;
    //   formtype = 'ballina';
    // }else if(stockLocation === 'sligo' && oldLocation === 'ballina'){
    //   subject = this.coffinBallina;
    //   formtype = 'ballina';
    // } else if(stockLocation === 'sligo' && oldLocation === 'sligo'){
    //   subject = this.coffin;
    //   formtype = 'sligo';
    // }
    // console.log('oldCoffin.id');

        console.log(coffinId);
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.coffin;
      }),
      take(1),
      switchMap((coffin) => {
        console.log('coffin joint');
        console.log(coffin)

        if (!coffin || coffin.length <= 0) {
          console.log('error');

          return this.fetchAllCoffins();
        } else {
          return of(coffin);
        }
      }),
      switchMap((coffin) => {
        console.log(coffin);
        const updateCoffinIndex = coffin.findIndex((pl) => pl.id === coffinId);
        updateCoffin = [...coffin];
        const oldCoffin = updateCoffin[updateCoffinIndex];

        updateCoffin[updateCoffinIndex] = new Coffin(
          oldCoffin.id,
          coffinName,
          stockLevel,
          stockLocation
        );

        //  if(stockLocation === 'sligo' && stockLocation !== oldCoffin.stockLocation){
        //   console.log('res.stockLocation ballina');

        //   console.log(stockLocation);
        //   this._coffinBallina.next(coffin.concat(updateCoffin));
        // } else if(stockLocation === 'sligo' && stockLocation === oldCoffin.stockLocation){
        //   this._coffin.next(updateCoffin);
        // } else if(stockLocation === 'ballina' && stockLocation !== oldCoffin.stockLocation) {
        //   console.log('res.stockLocation sligo');

        //   this._coffin.next(coffin.concat(updateCoffin));
        //   console.log(stockLocation);

        // } else if(stockLocation === 'ballina' && stockLocation === oldCoffin.stockLocation) {
        //   console.log('res.stockLocation sligo');

        //   this._coffinBallina.next(updateCoffin);
        //   console.log(stockLocation);

        // }

        return this.http.put<Coffin>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/coffins/${coffinId}.json?auth=${fetchedToken}`,
          { ...updateCoffin[updateCoffinIndex] }
        );
      }),
      tap((res) => {
        // if(res.stockLocation === 'ballina'){
        //   console.log('res.stockLocation ballina');

        //   console.log(res.stockLocation);
        //   this._coffinBallina.next(updateCoffin);
        // } else if(res.stockLocation === 'sligo') {
        //   console.log('res.stockLocation sligo');

          // this._coffin.next(updateCoffin);
        //   console.log(res.stockLocation);

        // }
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

  deleteCoffinBallina(coffinId: string){
    console.log('ballina');
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
