import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CoffinSalesService } from '../coffin-sales.service';
import { CoffinSale } from '../coffin.model';

@Component({
  selector: 'app-view-coffin-sale',
  templateUrl: './view-coffin-sale.page.html',
  styleUrls: ['./view-coffin-sale.page.scss'],
})
export class ViewCoffinSalePage implements OnInit {

  @Input() coffinSaleId;
  isLoading = false;
  coffinSale: CoffinSale;
  modal: HTMLIonModalElement;

  private coffinSaleSub: Subscription;

  constructor(
    private coffinSaleService: CoffinSalesService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    if (!this.coffinSaleId) {
      this.navCtrl.navigateBack('/menu/tabs/reports/coffin-sales');
      return;
    }

    this.isLoading = true;
    this.coffinSaleSub = this.coffinSaleService
    .getCoffinSale(this.coffinSaleId)
    .subscribe((coffinSale) => {
      this.coffinSale = coffinSale;
      this.isLoading = false;
    });
  }

  onDeleteDonation(){
    this.modal.dismiss(
      {
        editCoffinSale: {
          coffinSaleId: this.coffinSaleId,
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
