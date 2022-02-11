import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DebtorsPageRoutingModule } from './debtors-routing.module';

import { DebtorsPage } from './debtors.page';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DebtorsPageRoutingModule,
        ScrollingModule,
        SharedModule
    ],
    declarations: [DebtorsPage]
})
export class DebtorsPageModule {}
