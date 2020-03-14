import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';

import { AdminLayoutComponent } from '../theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '../theme/auth-layout/auth-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './sessions/login/login.component';
import { RegisterComponent } from './sessions/register/register.component';
import { AuthGuard } from '@shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard', titleI18n: 'dashboard' },
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
        data: { title: 'Profile', titleI18n: 'profile' },
      },
      {
        path: 'sessions',
        loadChildren: () => import('./sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: 'Sessions', titleI18n: 'sessions' },
      },
      {
        path: 'category',
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
        data: { title: 'Category', titleI18n: 'category' },
        canActivate: [AuthGuard],
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
        data: { title: 'Product', titleI18n: 'product' },
        canActivate: [AuthGuard],
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        data: { title: 'User', titleI18n: 'user' },
        canActivate: [AuthGuard],
      },
      {
        path: 'accounting',
        loadChildren: () => import('./accounting/accounting.module').then(m => m.AccountingModule),
        data: { title: 'Accounting', titleI18n: 'accounting' },
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, data: { title: 'Login', titleI18n: 'login' } },
      {
        path: 'register',
        component: RegisterComponent,
        data: { title: 'Register', titleI18n: 'register' },
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
    }),
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class RoutesRoutingModule {}
