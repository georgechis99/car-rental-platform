import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { LoginComponent } from './account/login/login.component';
import { TranslationsModule } from './shared/translations/translations.module';
import { AuthGuard } from './account/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'account', loadChildren: () => import('./account/account.module').then((mod) => mod.AccountModule)},
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module')
        .then((mod) => mod.DashboardModule),
        canActivate: [AuthGuard],
    data: { preload: true }
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    TranslationsModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
