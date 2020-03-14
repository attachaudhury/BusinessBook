import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesListComponent } from './saleslist/saleslist.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseListComponent } from './purchaselist/purchaselist.component';
import { SaleTerminalComponent } from './saleterminal/saleterminal.component';
import { ProductSalesReportComponent } from './productsalesreport/productsalesreport.component';

const routes: Routes = [
  { path: 'saleslist', component: SalesListComponent, data: { title: 'Sales List' } },
  { path: 'purchasenew', component: PurchaseComponent, data: { title: 'New Purchase' } },
  { path: 'purchaselist', component: PurchaseListComponent, data: { title: 'Purchase List' } },
  { path: 'saleterminal', component: SaleTerminalComponent, data: { title: 'Sale Terminal' } },
  { path: 'productsalesreport', component: ProductSalesReportComponent, data: { title: 'Products Sales Report' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
