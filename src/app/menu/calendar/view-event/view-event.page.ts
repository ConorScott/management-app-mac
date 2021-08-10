import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.page.html',
  styleUrls: ['./view-event.page.scss'],
})
export class ViewEventPage implements OnInit {
  @Input() eventId: string;
  @Input() title: string;
  @Input() start: string;
  @Input() end: string;
  @Input() allDay: boolean;
  desc: string;
  returnDate: Date;
  eventDesc: string;
  modal: HTMLIonModalElement;
  dayOff = false;
  dayOffDesc = 'Day Off';
  dayIn = 'Day In Lieu';


  constructor(private modalCtrl: ModalController, private calendarService: CalendarService) { }

  ngOnInit() {
    console.log(this.allDay);
    this.calendarService.getEventEdit(this.eventId).subscribe(event => {
      console.log(event);
      this.desc = event.desc;

      if(this.allDay === true){
        this.returnDate = new Date(event.end);
      this.returnDate.setHours(this.returnDate.getHours() + 1);
      console.log(this.returnDate);
      }
    });
    if(this.allDay === true){
      this.dayOff = true;
    }
    // this.eventDesc = this.title.split(' ')[1];
    // this.title = this.title.split(' ')[0];


    console.log(this.dayOffDesc);
  }

  onEditEvent(){
    this.modal.dismiss(
      {
        editEvent: {
          eventId: this.eventId,
          action: 'edit'
        }
      },
      'confirm'
    );

  }

  onDeleteEvent(){
    this.modal.dismiss(
      {
        editEvent: {
          eventId: this.eventId,
          action: 'delete'
        }
      },
      'confirm'
    );
  }

  onCancel(){
    this.modal.dismiss(null, 'cancel');
  }

}
