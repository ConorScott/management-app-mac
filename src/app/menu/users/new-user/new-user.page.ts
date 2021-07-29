import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.page.html',
  styleUrls: ['./new-user.page.scss'],
})
export class NewUserPage implements OnInit {
  form: FormGroup;
  createdAt: Date;
  modal: HTMLIonModalElement;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        ,

      }),
      password: new FormControl(null, {
        validators: [Validators.required,
          Validators.minLength(7)],

      }),
      role: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onCancel() {
    this.modal.dismiss(null, 'cancel');
  }

  onAddUser() {
    if (!this.form.valid) {
      return;
    }

    this.modal.dismiss(
      {
        userData: {
          email: this.form.value.email,
          password: this.form.value.password,
          name: this.form.value.name,
          role: this.form.value.role,
          createdAt: this.createdAt,
        }
      },
      'confirm'
    );
  }

}
