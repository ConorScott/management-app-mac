import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewUserPage } from './new-user/new-user.page';
import { EditUserPage } from './edit-user/edit-user.page';

import { ScrollingModule } from '@angular/cdk/scrolling';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    UsersPageRoutingModule,
    SharedModule,
    ScrollingModule
  ],
  declarations: [UsersPage, NewUserPage, EditUserPage],
  entryComponents: [NewUserPage]
})
export class UsersPageModule {}
