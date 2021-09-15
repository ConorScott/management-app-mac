import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { CoffinService } from '../coffin.service';

@Component({
  selector: 'app-new-coffin',
  templateUrl: './new-coffin.page.html',
  styleUrls: ['./new-coffin.page.scss'],
})
export class NewCoffinPage implements OnInit {

  form: FormGroup;
  modal: HTMLIonModalElement;

  constructor(
    private coffinService: CoffinService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      id: new FormControl(null , {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      coffinName: new FormControl(null, {
        validators: [Validators.required]
      }),
      stockLevel: new FormControl(null, {
        validators: [Validators.required]
      }),
      stockLocation: new FormControl(null, {
        validators: [Validators.required]
      }),
    });
  }

  onCreateCoffin(){
    this.loadingCtrl
      .create({
        message: 'Creating Coffin Entry...'
      }).then(loadingEl => {
        loadingEl.present();
        this.coffinService.addCoffin(
           this.form.value.coffinName,
           this.form.value.stockLevel,
           this.form.value.stockLocation
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
