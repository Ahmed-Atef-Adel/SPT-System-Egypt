import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorLayoutComponent } from './shared/layout-components/layout/error-layout/error-layout.component';
import { errorRoute } from './shared/routes/error.routes';
import { TripDataComponent } from './trip-data/trip-data.component';
import { DriverDataComponent } from './driver-data/driver-data.component';
import { VehiclesDataComponent } from './vehicles-data/vehicles-data.component';
import { TripAssignmentComponent } from './trip-assignment/trip-assignment.component';
import { DriverAppComponent } from './driver-app/driver-app.component';
 
 

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ErrorLayoutComponent,
    //canActivate: [AdminGuard],
    children: errorRoute
  },
  {
    path: 'trips',
    component: TripDataComponent,
    //canActivate: [AdminGuard],
    children: errorRoute
  },
  {
    path: 'drivers',
    component: DriverDataComponent,
    //canActivate: [AdminGuard],
    children: errorRoute
  },
   {
    path: 'vehicles',
    component: VehiclesDataComponent,
    //canActivate: [AdminGuard],
    children: errorRoute
  },
 {
    path: 'assignments',
    component: TripAssignmentComponent,
    //canActivate: [AdminGuard],
    children: errorRoute
  },
   {
    path: 'driver-app',
    component: DriverAppComponent,
    //canActivate: [AdminGuard],
    children: errorRoute
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }
 
 
   

  // {
  //   path: '**',
  //   redirectTo: '/error-pages/error-404'
  // },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
