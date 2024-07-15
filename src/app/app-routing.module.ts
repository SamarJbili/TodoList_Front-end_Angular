import { NgModule, SimpleChange } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AccueilComponent } from './accueil/accueil.component';
import { SinginComponent } from './singin/singin.component';
import { AjouttachesComponent } from './ajouttaches/ajouttaches.component';
import { UserComponent } from './user/user.component';
import { TasksComponent } from './tasks/tasks.component';
import { AdminComponent } from './admin/admin.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { CompteComponent } from './compte/compte.component';

const routes: Routes = [
  {path:'',component:AccueilComponent},
  {path:"login", component:LoginComponent},
  {path:"singin",component:SinginComponent},
  {path:"ajouttache/:id",component:AjouttachesComponent},
  {path:"user/:id",component:UserComponent},
  {path:"tasks/:id",component:TasksComponent},
  {path:'admin/:id',component:AdminComponent},
  {path:"super_admin",component:SuperAdminComponent},
  {path:"compte/:id",component:CompteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  
})
export class AppRoutingModule {}