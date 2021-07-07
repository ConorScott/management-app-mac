import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ChurchService } from '../church.service';

@Component({
  selector: 'app-new-church',
  templateUrl: './new-church.page.html',
  styleUrls: ['./new-church.page.scss'],
})
export class NewChurchPage implements OnInit {

  form: FormGroup;

  constructor(
    private churchService: ChurchService,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      id: new FormControl(null , {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      churchName: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onCreateChurch(){
    this.loadingCtrl
      .create({
        message: 'Creating Church Entry...'
      }).then(loadingEl => {
        loadingEl.present();
        this.churchService.addChurch(
           this.form.value.churchName
        ).subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
        });
      });

  }

}
