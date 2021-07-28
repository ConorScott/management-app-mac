import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

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
  @Input() allDay: string;
  modal: HTMLIonModalElement;


  constructor(private modalCtrl: ModalController ) { }

  ngOnInit() {
    console.log(this.eventId);
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
