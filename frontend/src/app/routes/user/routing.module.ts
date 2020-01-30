import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: 'add', component: AddComponent, data: { title: 'Add User' } },
  { path: 'list', component: ListComponent, data: { title: 'List All User' } },
  { path: 'edit/:_id', component: EditComponent, data: { title: 'Edit User' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
