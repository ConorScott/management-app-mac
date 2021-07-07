import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Cemetery } from '../cemetery.model';
import { CemeteryService } from '../cemetery.service';

@Component({
  selector: 'app-edit-cemetry',
  templateUrl: './edit-cemetery.page.html',
  styleUrls: ['./edit-cemetery.page.scss'],
})
export class EditCemetryPage implements OnInit {
  @Input() cemeteryId: string;
  cemetery: Cemetery;
  modal: HTMLIonModalElement;
  form: FormGroup;
  isLoading = false;
  private cemeterySub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private cemeteryService: CemeteryService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
      if (!this.cemeteryId) {
        this.navCtrl.navigateBack('/menu/tabs/data-entry/cemetery-list');
        return;
      }
      this.isLoading = true;
      this.cemeterySub = this.cemeteryService
        .getCemeterys(this.cemeteryId)
        .subscribe(
          (cemetery) => {
            this.cemetery = cemetery;
            this.form = new FormGroup({
              cemeteryName: new FormControl(this.cemetery.cemeteryName, {
                updateOn: 'blur',
                validators: [Validators.required],
              })
            });
            this.isLoading = false;
          },
          (error) => {
            this.alertCtrl
              .create({
                header: 'An error occurred!',
                message:
                  'Cemetery information could not be fetched. Please try again later.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/menu/tabs/data-entry/cemetery-list']);
                    },
                  },
                ],
              })
              .then((alertEl) => {
                alertEl.present();
              });
          }
        );
  }

  // onUpdateCemetery() {
  //   if (!this.form.valid) {
  //     return;
  //   }
  //   this.loadingCtrl
  //     .create({
  //       message: 'Updating Cemetery Information...',
  //     })
  //     .then((loadingEl) => {
  //       loadingEl.present();
  //       this.cemeteryService
  //         .updateCemetery(this.cemetery.id, this.form.value.cemeteryName)
  //         .subscribe(() => {
  //           loadingEl.dismiss();
  //           this.form.reset();
  //           this.router.navigate(['/menu/tabs/data-entry/cemetery-list']);
  //         });
  //     });
  // }
  onUpdateCemetery(){
    console.log(this.form.value.cemeteryName);
    this.modal.dismiss(
      {
        editCemetery: {
          cemeteryName: this.form.value.cemeteryName,
        }
      },
      'confirm'
    );
    this.form.reset();
}

onCancel() {

  this.modal.dismiss(null, 'cancel');


}
}
