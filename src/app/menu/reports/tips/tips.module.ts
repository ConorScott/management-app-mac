import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TipsPageRoutingModule } from './tips-routing.module';

import { TipsPage } from './tips.page';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ViewTipPage } from './view-tip/view-tip.page';
import { EditTipPage } from './edit-tip/edit-tip.page';
import { NewTipPage } from './new-tip/new-tip.page';
import { TipStatsPage } from './tip-stats/tip-stats.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TipsPageRoutingModule,
        ReactiveFormsModule,
        ScrollingModule
    ],
    declarations: [TipsPage, ViewTipPage, EditTipPage, NewTipPage, TipStatsPage]
})
export class TipsPageModule {}
