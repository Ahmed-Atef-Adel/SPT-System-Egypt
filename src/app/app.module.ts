import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
 
import { AppComponent } from './app.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { DragulaModule } from 'ng2-dragula';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxNotifierModule } from 'ngx-notifier';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { TranslateHttpLoader, } from '@ngx-translate/http-loader';

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { BaseURlHandlerInterceptor } from './shared/interceptors/base-url-handler';
 

import { LoaderService } from './shared/services/loader.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from './shared/guard/auth.service';
 
import { LoaderHandlerInterceptor } from './shared/interceptors/loader-handler';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { DialogModule } from '@angular/cdk/dialog';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ScrollerModule } from 'primeng/scroller';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
 
import { SortService } from './shared/common/sort';
import { ConfigService } from './shared/services/config.service';
 
 
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
 
import { environment } from 'src/environments/environment';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { TripDataComponent } from './trip-data/trip-data.component';
import { DriverDataComponent } from './driver-data/driver-data.component';
import { BadgeModule } from 'primeng/badge';
import { VehiclesDataComponent } from './vehicles-data/vehicles-data.component';
import { AppRoutingModule } from './app-routing.module';
import { TripAssignmentComponent } from './trip-assignment/trip-assignment.component';
import { DriverAppComponent } from './driver-app/driver-app.component';
 


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}
export function initializeApp(appInitService: ConfigService) {
  return (): Promise<any> => {
    return appInitService.Init();
  };
}
@NgModule({
  declarations: [
  
    DriverDataComponent,
    TripDataComponent,
    VehiclesDataComponent,
    TripAssignmentComponent,
    DriverAppComponent
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    TooltipModule,
    HttpClientModule,
    AngularFireMessagingModule,
    MatProgressSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DragulaModule.forRoot(),
    NgxSliderModule,
    PerfectScrollbarModule,
    CarouselModule,
    NgxNotifierModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule,
    MatTreeModule, MatIconModule, MatProgressBarModule,
    GalleryModule.withConfig({
    }),
    LightboxModule,
    BrowserAnimationsModule,

    //primeng
    ButtonModule,
    ColorPickerModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    PaginatorModule,
    SelectButtonModule,
    ScrollerModule,
    TableModule,
 BadgeModule ,
 TooltipModule ,
    TriStateCheckboxModule,
   
  ],
  providers: [
 
    AsyncPipe,
   JwtHelperService,
     { provide: JWT_OPTIONS, useValue: JWT_OPTIONS } ,
    AuthService,
 
    SortService,
    LoaderService,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseURlHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderHandlerInterceptor,
      multi: true,
    },
    ColorPickerService,
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      },
    },

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
