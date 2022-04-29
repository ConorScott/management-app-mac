import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/user.model';
import { StoreUser } from '../storeUser.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
})
export class ViewUserComponent implements OnInit {
  @Input() userId;
  isLoading = false;
  user: StoreUser;
  modal: HTMLIonModalElement;

  private userSub: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    if (!this.userId) {
      this.onCancel();
      return;
    }

    this.isLoading = true;
    this.userSub = this.userService
    .getUser(this.userId)
    .subscribe((user) => {
      this.user = user;
      this.isLoading = false;
    });
  }

  onEditUser(){
    this.modal.dismiss(
      {
        editUser: {
          userId: this.userId,
          action: 'edit'
        }
      },
      'confirm'
    );

  }

  onDeleteUser(){
    this.modal.dismiss(
      {
        editUser: {
          userId: this.userId,
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
