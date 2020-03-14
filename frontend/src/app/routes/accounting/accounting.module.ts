import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RoutingModule } from './routing.module';

import { SalesListComponent } from './saleslist/saleslist.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseListComponent } from './purchaselist/purchaselist.component';
import { SaleTerminalComponent } from './saleterminal/saleterminal.component';
import { ProductSalesReportComponent } from './productsalesreport/productsalesreport.component';

const COMPONENTS = [ SalesListComponent,PurchaseComponent,PurchaseListComponent,SaleTerminalComponent,ProductSalesReportComponent];
const COMPONENTS_DYNAMIC = [];

@NgModule({
  imports: [SharedModule, RoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_DYNAMIC],
  entryComponents: COMPONENTS_DYNAMIC,
})
export class AccountingModule {}
