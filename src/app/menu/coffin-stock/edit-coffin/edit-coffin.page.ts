import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Coffin } from '../coffin.model';
import { CoffinService } from '../coffin.service';

@Component({
  selector: 'app-edit-coffin',
  templateUrl: './edit-coffin.page.html',
  styleUrls: ['./edit-coffin.page.scss'],
})
export class EditCoffinPage implements OnInit, OnDestroy {
  @Input() coffinId: string;
  coffin: Coffin;
  form: FormGroup;
  isLoading = false;
  modal: HTMLIonModalElement;
  private coffinSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private coffinService: CoffinService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
      if (!this.coffinId) {
        this.navCtrl.navigateBack('/menu/tabs/data-entry/coffin-list');
        return;
      }
      this.isLoading = true;
      this.coffinSub = this.coffinService
        .getCoffin(this.coffinId)
        .subscribe(
          (coffin) => {
            this.coffin = coffin;
            this.form = new FormGroup({
              coffinName: new FormControl(this.coffin.coffinName, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              stockLevel: new FormControl(this.coffin.stockLevel, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              stockLocation: new FormControl(this.coffin.stockLocation, {
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
                  'Coffin information could not be fetched. Please try again later.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/menu/tabs/data-entry/coffin-list']);
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

  onUpdateCoffin() {
      this.modal.dismiss(
        {
          editCoffin: {
            coffinName: this.form.value.coffinName,
            stockLevel: this.form.value.stockLevel,
            stockLocation: this.form.value.stockLocation,
            oldstocklocation: this.coffin.stockLocation
          }
        },
        'confirm'
      );
      this.form.reset();
  }

  ngOnDestroy(){
    this.coffinSub.unsubscribe();
  }

  onCancel() {
    this.modal.dismiss(null, 'cancel');
  }

}
