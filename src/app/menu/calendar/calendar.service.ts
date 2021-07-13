/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Event } from './event.model';

interface EventData {
  title: string;
  start: Date;
  end: Date;
  color;
  allDay: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private _calendar = new BehaviorSubject<Event[]>([]);

  get calendar() {
    return this._calendar.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  addEvent(
    title: string,
    start: Date,
    end: Date,
    color,
    allDay: boolean
  ) {
    let generateId: string;
    let newCalendar: Event;
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
        // newCalendar = events;
        newCalendar = new Event(
          Math.random().toString(),
          title,
          start,
          end,
          color,
          allDay
        );
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/events.json?auth=${token}`,
          { ...newCalendar, id: null }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.calendar;
      }),
      take(1),
      tap((calendar) => {
        newCalendar.id = generateId;
        this._calendar.next(calendar.concat(newCalendar));
      })
    );
  }

  addReposeEvent(
    title: string,
    start: Date,
    end: Date,
    color,
  ) {
    let generateId: string;
    let newCalendar: Event;
    let fetchedUserId: string;
    const allDay = false;
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
        // newCalendar = events;
        newCalendar = new Event(
          Math.random().toString(),
          title,
          start,
          end,
          color,
          allDay
        );
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/events.json?auth=${token}`,
          { ...newCalendar, id: null }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.calendar;
      }),
      take(1),
      tap((calendar) => {
        newCalendar.id = generateId;
        this._calendar.next(calendar.concat(newCalendar));
      })
    );
  }

  fetchEvents() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: EventData }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/events.json?auth=${token}`
        );
      }),
        map((resData) => {
          const calendar = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              calendar.push(
                new Event(
                  key,
                  resData[key].title,
                  new Date(resData[key].start),
                  new Date(resData[key].end),
                  resData[key].color,
                  resData[key].allDay
                )
              );
            }
          }
          return calendar;
        }),
        tap((calendar) => {
          this._calendar.next(calendar);
          console.log(calendar);
        })
      );
  }
  // getEvent(id: string){
  //   return this.authService.token.pipe(
  //     take(1),
  //     // eslint-disable-next-line arrow-body-style
  //     switchMap((token) => {
  //       return this.http.get<EventData>(
  //         `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/calendar/${id}.json?auth=${token}`
  //       );
  //     }),
  //     map((resData) => {
  //       return new Event(
  //         id,
  //         resData.title,
  //         resData.start,
  //         resData.end,
  //         resData.color,
  //         resData.allDay
  //         );
  //     })
  //   );
  // }
}
