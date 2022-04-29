import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { Deceased } from '../deceased.model';

@Component({
  selector: 'app-radio-notice-layout',
  templateUrl: './radio-notice-layout.component.html',
  styleUrls: ['./radio-notice-layout.component.scss'],
})
export class RadioNoticeLayoutComponent implements OnInit {

  @Input() deceased: Deceased;
  radioNoticePar3 = 'You are welcome to send a message of condolence to his/her family on the Foley and McGowan funeral home website www.sligofuneralhome.ie';
  radioNoticePar4 = 'Enquiries to The Foley and McGowan Funeral Home, Market Yard, Sligo 0719162140/info@sligofuneralhome.ie';

  constructor(private renderer: Renderer2, public printer: Printer) { }

  ngOnInit() {}

  printDiv(div) {
    this.printer.isAvailable().then((onSuccess: any) => {
    let content = document.getElementById(div).innerHTML;
    let options: PrintOptions = {
    name: 'MyDocument',
    duplex: true,
    orientation: "portrait",
    monochrome: true
    };
    this.printer.print(content, options).then((value: any) => {
    console.log('value:', value);
    }, (error) => {
    console.log('err:', error);
    });
    }, (err) => {
    console.log('err:', err);
    });
    }

}
