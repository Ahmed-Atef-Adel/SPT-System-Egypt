import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
 
 

const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
  },

  {
    path: 'auth/forgot-password',
    component: ForgetPasswordComponent
  },
  {
    path: 'module-selection',
    component: HomeComponent,
    
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
