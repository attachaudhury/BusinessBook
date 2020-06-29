import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerAddComponent } from './customeradd/customeradd.component';
import { CustomerListComponent } from './customerlist/customerlist.component';
import { CustomerEditComponent } from './customeredit/customeredit.component';

const routes: Routes = [
  { path: 'customeradd', component: CustomerAddComponent, data: { title: 'Add Customer' } },
  { path: 'customerlist', component: CustomerListComponent, data: { title: 'List All Customer' } },
  { path: 'customeredit/:_id', component: CustomerEditComponent, data: { title: 'Edit Customer' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
