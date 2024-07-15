import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { SinginComponent } from './singin/singin.component';
import { AjouttachesComponent } from './ajouttaches/ajouttaches.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { TasksComponent } from './tasks/tasks.component';
import { AdminComponent } from './admin/admin.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { CompteComponent } from './compte/compte.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccueilComponent,
    SinginComponent,
    AjouttachesComponent,
    UserComponent,
    TasksComponent,
    AdminComponent,
    SuperAdminComponent,
    CompteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
