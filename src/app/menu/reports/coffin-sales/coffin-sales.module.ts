import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CoffinSalesPageRoutingModule } from './coffin-sales-routing.module';

import { CoffinSalesPage } from './coffin-sales.page';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ViewCoffinSalePage } from './view-coffin-sale/view-coffin-sale.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoffinSalesPageRoutingModule,
    ScrollingModule
  ],
  declarations: [CoffinSalesPage, ViewCoffinSalePage]
})
export class CoffinSalesPageModule {}
