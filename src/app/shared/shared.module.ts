import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout-components/header/header.component';
import { FooterComponent } from './layout-components/footer/footer.component';
import { LoaderComponent } from './layout-components/loader/loader.component';
import { PageHeaderComponent } from './layout-components/page-header/page-header.component';
import { SidebarComponent } from './layout-components/sidebar/sidebar.component';
import { SwitcherComponent } from './layout-components/switcher/switcher.component';
import { TabToTopComponent } from './layout-components/tab-to-top/tab-to-top.component';
import { ContentLayoutComponent } from './layout-components/layout/content-layout/content-layout.component';
import { ErrorLayoutComponent } from './layout-components/layout/error-layout/error-layout.component';
import { FullLayoutComponent } from './layout-components/layout/full-layout/full-layout.component';
import { NgbActiveModal, NgbDateAdapter, NgbDateNativeUTCAdapter, NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { RightSidebarComponent } from './layout-components/right-sidebar/right-sidebar.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FullscreenDirective } from './directives/fullscreen-toggle.directive';
import { ColorPickerModule } from 'ngx-color-picker';
import { HoverEffectSidebarDirective } from './directives/hover-effect-sidebar.directive';
import { ToggleThemeDirective } from './directives/toggle-theme.directive';
import { SidemenuToggleDirective } from './directives/sidemenuToggle';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthService } from './guard/auth.service';
import { JWT_OPTIONS, JwtHelperService, JwtModule, JwtModuleOptions } from '@auth0/angular-jwt';
import { CdTimerModule } from 'angular-cd-timer';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
 
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE, OwlDateTimeIntl, OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { ArchwizardModule } from 'angular-archwizard';
import { MatStepperModule } from '@angular/material/stepper';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';
 
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS_FACTORY }
  from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';

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
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { DxReportViewerModule } from 'devexpress-reporting-angular';
 
 
import { MatPaginatorModule } from '@angular/material/paginator';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import * as moment from 'moment';
import { CustomOwlDateTimeIntl } from 'src/assets/CustomOwlDateTimeIntl';
import { FilterTableDirective } from './common/filter-table.directive';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { LoansLayoutComponent } from './layout-components/layout/loans-layout/loans-layout.component';
import { LoanSidebarComponent } from './layout-components/loan-sidebar/loan-sidebar.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: true
};

@NgModule({
  declarations: [

    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    PageHeaderComponent,
    SidebarComponent,
    SwitcherComponent,
    TabToTopComponent,
    ContentLayoutComponent,
    ErrorLayoutComponent,
    FullLayoutComponent,
    RightSidebarComponent,
    FullscreenDirective,
    HoverEffectSidebarDirective,
    ToggleThemeDirective,
    SidemenuToggleDirective,
 
 
 
    FilterTableDirective,
    LoansLayoutComponent,
    LoanSidebarComponent,
  ],
  imports: [

    CommonModule,
    NgxSpinnerModule,
    DxReportViewerModule,
    ArchwizardModule,
    NgbModule,
    RouterModule,
    PerfectScrollbarModule,
    ColorPickerModule,
    HttpClientModule,
    TranslateModule,
 
    NgSelectModule,
    NgCircleProgressModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    MatButtonModule,
    MatDialogModule,
    NgxDropzoneModule,
    CdTimerModule,
    MatStepperModule,
    AutocompleteLibModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
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
    TooltipModule,
    TriStateCheckboxModule,
    MultiSelectModule,
    SliderModule,
    ProgressBarModule,
    TagModule,
    NgbTypeaheadModule,
    MatPaginatorModule

  ],
  exports: [
    FilterTableDirective,
    PageHeaderComponent, TabToTopComponent, FullLayoutComponent,
    ContentLayoutComponent, ErrorLayoutComponent, SwitcherComponent, LoaderComponent,
    TranslateModule,
 
    BsDatepickerModule,
    NgbModule,
 
    NgSelectModule,
    NgCircleProgressModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule, MatDialogModule,
    LoaderComponent,
    NgxDropzoneModule,
    CdTimerModule,
  
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    
    ArchwizardModule,
    MatStepperModule,
    AutocompleteLibModule,
    NgbTypeaheadModule,
    MatPaginatorModule,
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
    TooltipModule,
    TriStateCheckboxModule,
    MultiSelectModule,
    SliderModule,
    ProgressBarModule,
    TagModule,
    MatSortModule
  ],
  providers: [
    [JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },],
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: OWL_DATE_TIME_LOCALE, useValue: localStorage.getItem('currentLang') },
    { provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: OwlDateTimeIntl, useClass: CustomOwlDateTimeIntl },
    NgbActiveModal,
    [{ provide: BsDatepickerConfig, useFactory: getDatepickerConfig }],

  ]
})
export class SharedModule { }
export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    showWeekNumbers: false,
    dateInputFormat: 'YYYY-MM-DD',
    outsideClick: true,
    outsideEsc: true,
    isAnimated: true,
    Zone: 'Local',
    autoclose: true,

  });
}
