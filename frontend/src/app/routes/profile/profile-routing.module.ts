import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { ProfileSettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileLayoutComponent,
    children: [
      { path: '', redirectTo: 'settings', pathMatch: 'full' },
      {
        path: 'settings',
        component: ProfileSettingsComponent,
        data: { title: 'Profile Settings' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
