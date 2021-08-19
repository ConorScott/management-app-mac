/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Calendar } from '@fullcalendar/angular';
import { id } from 'date-fns/locale';
import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Event } from './event.model';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#32a852',
  },
  lightRed: {
    primary: '#f20a0a',
  },
};

interface EventData {
  id: string;
  uid: string;
  title: string;
  start: Date;
  end: Date;
  color;
  allDay: boolean;
  desc?: string;
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

  // addEvent(title: string, start: Date, end: Date, color, allDay: boolean) {
  //   let generateId: string;
  //   let newCalendar: Event;
  //   let fetchedUserId: string;
  //   return this.authService.userId.pipe(
  //     take(1),
  //     switchMap((userId) => {
  //       if (!userId) {
  //         throw new Error('No user id found!');
  //       }
  //       fetchedUserId = userId;
  //       return this.authService.token;
  //     }),
  //     take(1),
  //     switchMap((token) => {
  //       // newCalendar = events;
  //       newCalendar = new Event(
  //         Math.random().toString(),
  //         uid,
  //         title,
  //         start,
  //         end,
  //         color,
  //         allDay
  //       );
  //       return this.http.post<{ name: string }>(
  //         `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/events.json?auth=${token}`,
  //         { ...newCalendar, id: null }
  //       );
  //     }),
  //     switchMap((resData) => {
  //       generateId = resData.name;
  //       return this.calendar;
  //     }),
  //     take(1),
  //     tap((calendar) => {
  //       newCalendar.uid = generateId;
  //       this._calendar.next(calendar.concat(newCalendar));
  //     })
  //   );
  // }
  addEvent(title: string, start: Date, end: Date, color, desc: string) {
    let generateId: string;
    let newCalendar: Event;
    let fetchedUserId: string;
    let uid: string;
    const allDay = false;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        fetchedUserId = userId;
        uid = fetchedUserId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        // newCalendar = events;
        newCalendar = new Event(Math.random().toString(), uid, title, start, end, color, allDay, desc);
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
        newCalendar.uid = generateId;
        this._calendar.next(calendar.concat(newCalendar));
      })
    );
  }

  addReposeEvent(title: string, start: Date, end: Date, color) {
    let generateId: string;
    let newCalendar: Event;
    let fetchedUserId: string;
    let uid: string;
    const allDay = false;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        fetchedUserId = userId;
        uid = fetchedUserId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        // newCalendar = events;
        newCalendar = new Event(Math.random().toString(), uid, title, start, end, color, allDay);
        return this.http.post<{ name: string }>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/events.json?auth=${token}`,
          { ...newCalendar }
        );
      }),
      switchMap((resData) => {
        generateId = resData.name;
        return this.calendar;
      }),
      take(1),
      tap((calendar) => {
        newCalendar.uid = generateId;
        this._calendar.next(calendar.concat(newCalendar));
      })
    );
  }

  addDayOffEvent( title: string, start: Date, end: Date, color) {
    let generateId: string;
    let newCalendar: Event;
    let fetchedUserId: string;
    let uid: string;
    const allDay = true;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          throw new Error('No user id found!');
        }
        fetchedUserId = userId;
        uid = fetchedUserId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        // newCalendar = events;
        console.log(allDay);
        newCalendar = new Event(Math.random().toString(), uid, title, start, end, color, allDay);
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
        newCalendar.uid = generateId;
        this._calendar.next(calendar.concat(newCalendar));
      })
    );
  }

  updateEventTimes(
    eventId: string,
    title: string,
    start: Date,
    end: Date,
  ) {
    let updateCalendar: Event[];
    let fetchedToken: string;
    const allDay = false;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        fetchedToken = token;
        return this.calendar;
      }),
      take(1),
      switchMap((calendar) => {
        if (!calendar || calendar.length <= 0) {
          return this.fetchEvents();
        } else {
          return of(calendar);
        }
      }),
      switchMap((calendar) => {
        const updateCalendarIndex = calendar.findIndex(
          (pl) => pl.id === eventId
        );
        updateCalendar = [...calendar];
        const oldCalendar = updateCalendar[updateCalendarIndex];

        updateCalendar[updateCalendarIndex] = new Event(
          oldCalendar.id,
          oldCalendar.uid,
          title,
          start,
          end,
          oldCalendar.color,
          allDay
        );
        return this.http.put<Event>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/events/${eventId}.json?auth=${fetchedToken}`,
          { ...updateCalendar[updateCalendarIndex], id: null }
        );
      }),
      tap(() => {
        this._calendar.next(updateCalendar);
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
                resData[key].uid,
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

  reposeDate(deceasedName, reposeDate, reposeTime, reposeEndTime) {
    const date = reposeDate.split('T')[0];
    const time = reposeTime.split('T')[1];
    const end = reposeEndTime.split('T')[1];
    const reposeDateTime = date + 'T' + time;
    const endTime = date + 'T' + end;

    this.addReposeEvent(
      deceasedName + ' Repose Date',
      new Date(reposeDateTime),
      new Date(endTime),
      colors.blue
    ).subscribe();
  }

  removalTime(deceasedName, removalDate, removalTime) {
    const date = removalDate.split('T')[0];
    const time = removalTime.split('T')[1];
    const removalDateTime = date + 'T' + time;
    const endTime = new Date(removalDateTime);
    endTime.setHours(endTime.getHours() + 1);
    this.addReposeEvent(
      deceasedName + ' Removal Date',
      new Date(removalDateTime),
      endTime,
      colors.yellow
    ).subscribe();
  }
  churchArrivalTime(deceasedName, churchArrivalDate, churchArrivalTime) {
    const date = churchArrivalDate.split('T')[0];
    const time = churchArrivalTime.split('T')[1];
    const churchArrivalDateTime = date + 'T' + time;
    const endTime = new Date(churchArrivalDateTime);
    endTime.setHours(endTime.getHours() + 1);
    this.addReposeEvent(
      deceasedName + ' church Arrival Date',
      new Date(churchArrivalDateTime),
      endTime,
      colors.green
    ).subscribe();
  }
  massTime(deceasedName, massDate, massTime) {
    const date = massDate.split('T')[0];
    const time = massTime.split('T')[1];
    const massDateTime = date + 'T' + time;
    const endTime = new Date(massDateTime);
    endTime.setHours(endTime.getHours() + 1);
    this.addReposeEvent(
      deceasedName + ' Mass Date',
      new Date(massDateTime),
      endTime,
      colors.lightRed
    ).subscribe();
  }

  updateReposeDate(id, deceasedName, reposeDate, reposeTime, reposeEndTime) {
    const date = reposeDate.split('T')[0];
    const time = reposeTime.split('T')[1];
    const end = reposeEndTime.split('T')[1];
    const reposeDateTime = date + 'T' + time;
    const endTime = date + 'T' + end;

    this.updateEventTimes(
      id,
      deceasedName + ' Repose Date',
      new Date(reposeDateTime),
      new Date(endTime),
    ).subscribe();
  }

  updateRemovalTime(id, deceasedName, removalDate, removalTime) {
    const date = removalDate.split('T')[0];
    const time = removalTime.split('T')[1];
    const removalDateTime = date + 'T' + time;
    const endTime = new Date(removalDateTime);
    endTime.setHours(endTime.getHours() + 1);
    this.updateEventTimes(
      id,
      deceasedName + ' Removal Date',
      new Date(removalDateTime),
      endTime,
    ).subscribe();
  }

  updateChurchArrivalTime(id, deceasedName, churchArrivalDate, churchArrivalTime) {
    const date = churchArrivalDate.split('T')[0];
    const time = churchArrivalTime.split('T')[1];
    const churchArrivalDateTime = date + 'T' + time;
    const endTime = new Date(churchArrivalDateTime);
    endTime.setHours(endTime.getHours() + 1);
    this.getEvent(deceasedName + ' church Arrival Date').subscribe(event => {
      this.updateEventTimes(
      id,
      deceasedName + ' church Arrival Date',
      new Date(churchArrivalDateTime),
      endTime,
    ).subscribe();
    });
  }

  updateMassTime(id, deceasedName, massDate, massTime) {
    const date = massDate.split('T')[0];
    const time = massTime.split('T')[1];
    const massDateTime = date + 'T' + time;
    const endTime = new Date(massDateTime);
    endTime.setHours(endTime.getHours() + 1);
    this.updateEventTimes(
      id,
      deceasedName + ' Mass Date',
      new Date(massDateTime),
      endTime,
    ).subscribe();
  }

  getEvent(title: string){
    console.log(title);
    return this.authService.token.pipe(
      take(1),
      // eslint-disable-next-line arrow-body-style
      switchMap((token) => {
        return this.http.get<{ [key: string]: EventData}>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/events.json?orderBy="title"&equalTo"${title}"&auth=${token}`
        );
      }),
      map((resData) => {
        for (const key in resData) {
          if (resData.hasOwnProperty(key) && resData[key].title === title) {
            return new Event(
              key,
              resData[key].uid,
              resData[key].title,
              resData[key].start,
              resData[key].end,
              resData[key].color,
              resData[key].allDay
              );
          }
        }
      })
    );
  }

  getEventEdit(id: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<EventData>(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/events/${id}.json?auth=${token}`
        );
      }),
      map(eventData => {
        return new Event(
          id,
          eventData.uid,
          eventData.title,
          eventData.start,
          eventData.end,
          eventData.color,
          eventData.allDay,
          eventData.desc
        );
      })
    );
  }

  deleteEvent(eventId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http.delete(
          `https://management-app-df9b2-default-rtdb.europe-west1.firebasedatabase.app/events/${eventId}.json?auth=${token}`
        )),
      switchMap(() => this.calendar),
      take(1),
      tap((event) => {
        this._calendar.next(event.filter((b) => b.id !== eventId));
      })
    );
  }
}
