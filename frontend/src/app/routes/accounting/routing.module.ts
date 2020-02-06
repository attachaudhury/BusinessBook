import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosSalesListComponent } from './possaleslist/possaleslist.component';
import { PurchaseComponent } from './purchase/purchase.component';

const routes: Routes = [
  { path: 'possaleslist', component: PosSalesListComponent, data: { title: 'POS Sales' } },
  { path: 'purchase', component: PurchaseComponent, data: { title: 'Purchase' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
