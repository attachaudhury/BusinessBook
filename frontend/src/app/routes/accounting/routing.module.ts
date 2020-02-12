import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosSalesListComponent } from './possaleslist/possaleslist.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseListComponent } from './purchaselist/purchaselist.component';

const routes: Routes = [
  { path: 'possaleslist', component: PosSalesListComponent, data: { title: 'POS Sales' } },
  { path: 'purchasenew', component: PurchaseComponent, data: { title: 'Purchase' } },
  { path: 'purchaselist', component: PurchaseListComponent, data: { title: 'Purchase List' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
