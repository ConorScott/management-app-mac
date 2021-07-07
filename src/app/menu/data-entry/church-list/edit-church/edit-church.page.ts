import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Church } from '../church.model';
import { ChurchService } from '../church.service';

@Component({
  selector: 'app-edit-church',
  templateUrl: './edit-church.page.html',
  styleUrls: ['./edit-church.page.scss'],
})
export class EditChurchPage implements OnInit {
  @Input() churchId: string;
  church: Church;
  modal: HTMLIonModalElement;
  form: FormGroup;
  isLoading = false;
  private churchSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private churchService: ChurchService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
      if (!this.churchId) {
        this.navCtrl.navigateBack('/menu/tabs/data-entry');
        return;
      }
      this.isLoading = true;
      this.churchSub = this.churchService
        .getChurch(this.churchId)
        .subscribe(
          (church) => {
            this.church = church;
            console.log(this.church.churchName);
            this.form = new FormGroup({
              churchName: new FormControl(this.church.churchName, {
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
                  'Church information could not be fetched. Please try again later.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/menu/tabs/data-entry/church-list']);
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

  // UpdateChurch() {
  //   if (!this.form.valid) {
  //     return;
  //   }
  //   this.loadingCtrl
  //     .create({
  //       message: 'Updating Church Information...',
  //     })
  //     .then((loadingEl) => {
  //       loadingEl.present();
  //       this.churchService
  //         .updateChurch(this.church.id, this.form.value.churchName)
  //         .subscribe(() => {
  //           loadingEl.dismiss();
  //           this.form.reset();
  //           this.router.navigate(['/menu/tabs/data-entry/cemetery-list']);
  //         });
  //     });
  // }
  onUpdateChurch(){
    console.log(this.form.value.churchName);
    this.modal.dismiss(
      {
        editChurch: {
          churchName: this.form.value.churchName,
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
