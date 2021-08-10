import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CemeteryService } from '../cemetery.service';

@Component({
  selector: 'app-new-cemetry',
  templateUrl: './new-cemetery.page.html',
  styleUrls: ['./new-cemetery.page.scss'],
})
export class NewCemetryPage implements OnInit {

  form: FormGroup;
  modal: HTMLIonModalElement;

  constructor(
    private cemeteryService: CemeteryService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      id: new FormControl(null , {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      cemeteryName: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onCreateCemetery(){
    this.loadingCtrl
      .create({
        message: 'Creating Cemetery Entry...'
      }).then(loadingEl => {
        loadingEl.present();
        this.cemeteryService.addCemetery(
           this.form.value.cemeteryName
        ).subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.modal.dismiss();
        });
      });

  }

  onCancel(){
    this.modal.dismiss(null, 'cancel');
  }


}
