import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PosSalesListComponent } from './possaleslist/possaleslist.component';

const routes: Routes = [
  { path: 'possaleslist', component: PosSalesListComponent, data: { title: 'POS Sales' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
