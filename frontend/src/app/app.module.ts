import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ClarityModule} from '@clr/angular';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LayoutModule} from './layout/layout.module';
import {UsersComponent} from './users/users.component';
import {LoginComponent} from './auth/login/login.component';
import {AuthService} from './auth/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IsLoggedInGuard} from './auth/is-logged-in.guard';
import {IsLoggedOutGuard} from './auth/is-logged-out.guard';
import {UsersService} from './users/users.service';
import {HttpClientModule} from '@angular/common/http';
import {ModalDialogService} from './modals/dialog.service';
import {WarnDialogComponent} from './users/dialogs/warn-dialog.component';
import {ModalDialogComponent} from './modals/dialog.component';
import {BanDialogComponent} from './users/dialogs/ban-dialog.component';
import {MessagesService} from './messages/messages.service';
import {MessagesComponent} from './messages/messages.component';
import {HomeComponent} from './home.component';
import {EditMessageDialogComponent} from './messages/dialogs/edit-message-dialog.component';
import {EllipsisFilter} from './messages/ellipsis.filter';
import {CookieService} from 'ngx-cookie-service';

const dialogs = [
  ModalDialogComponent,
  WarnDialogComponent,
  BanDialogComponent,
  EditMessageDialogComponent
];

@NgModule({
  entryComponents: [
    ...dialogs
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    UsersComponent,
    MessagesComponent,
    EllipsisFilter,
    ...dialogs
  ],
  providers: [
    CookieService,
    AuthService,
    UsersService,
    MessagesService,
    IsLoggedInGuard,
    IsLoggedOutGuard,
    ModalDialogService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
