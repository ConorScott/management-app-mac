/* eslint-disable arrow-body-style */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Calendar } from './event.model';

interface EventData {
  title: string;
  desc: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private _calendar = new BehaviorSubject<Calendar[]>([]);

  get calendar() {
    return this._calendar.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  addEvent(
    title: string,
    desc: string,
    startTime: Date,
    endTime: Date,
    allDay: boolean
  ) {
    console.log(title);
    const newEvent = new Calendar(
      Math.random().toString(),
      title,
      desc,
      startTime,
      endTime,
      allDay
    );

     return this.http
      .post(
        'https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/calendar.json',
        { ...newEvent, id: null }
      );
  }

  fetchEvents() {
    return this.http
      .get<{ [key: string]: EventData }>(
        'https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/calendar.json'
      )
      .pipe(
        map((resData) => {
          const calendar = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              calendar.push(
                new Calendar(
                  key,
                  resData[key].title,
                  resData[key].desc,
                  resData[key].startTime,
                  resData[key].endTime,
                  resData[key].allDay
                )
              );
            }
          }
          return calendar;
        }),
        tap((calendar) => {
          this._calendar.next(calendar);
        })
      );
  }
  getEvent(id: string){
    return this.authService.token.pipe(
      take(1),
      // eslint-disable-next-line arrow-body-style
      switchMap((token) => {
        return this.http.get<EventData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/calendar/${id}.json?auth=${token}`
        );
      }),
      map((resData) => {
        return new Calendar(
          id,
          resData.title,
          resData.desc,
          resData.startTime,
          resData.endTime,
          resData.allDay
        );
      })
    );
  }
}
