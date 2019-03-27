import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {IsLoggedInGuard} from './auth/is-logged-in.guard';
import {IsLoggedOutGuard} from './auth/is-logged-out.guard';
import {HomeComponent} from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [IsLoggedInGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [IsLoggedOutGuard]
  },
  {path: '**', redirectTo: ''}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
