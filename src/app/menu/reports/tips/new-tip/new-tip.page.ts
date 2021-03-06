import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from '@firebase/util';
import { AlertController, LoadingController } from '@ionic/angular';
import { TipPaymentsService } from '../tip-payments.service';
import { Tips } from '../tips.model';
import { TipsService } from '../tips.service';

@Component({
  selector: 'app-new-tip',
  templateUrl: './new-tip.page.html',
  styleUrls: ['./new-tip.page.scss'],
})
export class NewTipPage implements OnInit {
  @Input() tipPayment: boolean;
  @Input() filtered: Tips[];
  names: Tips[];
  duplicate = [];


  form: FormGroup;
  modal: HTMLIonModalElement;

  currentPayee: string;
  payees: Array<string>;
  createdAt = new Date();
  payeeId: string;

  constructor(
    private tipsService: TipsService,
    private tipPaymentService: TipPaymentsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {

    for(let i = 0; i < this.filtered.length; i++){
      if(this.duplicate.indexOf(this.filtered[i].payeeName) === -1) {
        this.duplicate.push(this.filtered[i].payeeName);
      } else {
        console.log(`${this.filtered[i]} is already pushed`);
      }
    }
    console.log(this.duplicate);
    console.log('FInal Array: ', this.duplicate);
    this.payees = ['Ray Murtagh', 'Kieran Maughan', 'Terry Butler', 'Brian Scanlon', 'St. Anne’s Church Sligo', 'Other'];
    this.form = new FormGroup({
      entryDate: new FormControl(null, {
        validators: [Validators.required]
      }),
      entryAmount: new FormControl(null, {
        validators: [Validators.required]
      }),
      entryDesc: new FormControl(null, {
        validators: [Validators.required]
      }),
      payeeName: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
  }

  ionViewWillEnter(){
    this.tipPaymentService.fetchTipPayee().subscribe((res) => {
      console.log('res');
      this.names = [...res];
      console.log(res);

    });
  }

  onAddEntry(){

    this.loadingCtrl
      .create({
        message: 'Creating Entry',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.tipsService
          .addTips(
            this.form.value.entryDate,
            this.form.value.entryAmount,
            this.form.value.entryDesc,
            this.form.value.payeeName,
            this.createdAt
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.modal.dismiss();
          });
      });
  }
   checkTipPayee(){
    this.tipPaymentService.checkTipPayees(this.form.value.payeeName)
    .subscribe(res => {
      console.log('res')
    console.log(res);
      res.map(tip => {
        this.payeeId = tip.id;
        this.onAddTipPayment(this.payeeId);
      });
    });

  }

  onAddTipPayment(payeeId){



    this.loadingCtrl
      .create({
        message: 'Creating Entry',
      })
      .then((loadingEl) => {
        loadingEl.present();

        this.tipPaymentService
          .addTipPayment(
            this.form.value.entryDate,
            this.form.value.entryAmount,
            this.form.value.entryDesc,
            this.form.value.payeeName,
            this.createdAt,
            payeeId
          );

            loadingEl.dismiss();
            this.form.reset();
            this.modal.dismiss();

      });
  }

  async customSelect(event){
    console.log(event);
    if(event === 'Other'){
      const alert = await this.alertCtrl.create({
        header: 'Payee Name',
        cssClass: 'custom-payee',
        inputs: [
          {
            type: 'text',
            label: 'Payee Name',
            cssClass: 'payee-input',
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            cssClass: 'submit-button',
            handler: (data: any) => {
              this.currentPayee = '';
            }
          },
          {
            text: 'Submit',
            cssClass: 'submit-button',
            handler: (data: any) => {
              this.form.value.payeeName = data[0];
              this.currentPayee = data[0];
              console.log(this.form.value.payeeName);
            }
          }
        ]
      });
      await alert.present();
    }
    }

  onCancel(){
    this.modal.dismiss(null, 'cancel');
  }

}
