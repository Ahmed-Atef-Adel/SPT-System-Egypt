import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as switcher from '../../shared/layout-components/switcher/switcher';
import { SwitcherService } from '../../shared/services/switcher.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, delay, filter, fromEvent, map } from 'rxjs';
import { Language, LanguageService } from 'src/app/shared/services/language.service';
import { AuthService } from 'src/app/shared/guard/auth.service';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], 
})
export class LoginComponent implements OnInit {
  source$ : Observable<Event> = new Observable<Event>;
  language:any = Language
  public show: boolean = true;
  public loginForm: FormGroup ;
  public errorMessage: any;
  public showLoader: boolean = false;
  
  constructor( private fb: FormBuilder , private router: Router , 
    private switcherService: SwitcherService, private authService : AuthService,
     public translate: TranslateService ) {
      translate.addLangs([Language.en, Language.ar]);
      const langservice = new LanguageService(translate);
      let currentLanguage = localStorage?.getItem('currentLang') ?? 'en'
      translate.setDefaultLang(currentLanguage)
      langservice.updateCurrentLang(currentLanguage === 'en' ? Language.en : Language.ar)
      langservice.updateDirection();
      translate.use((localStorage.getItem('currentLang') ?? 'en'))
      this.loginForm = this.fb.group({
        userName: ["", [Validators.required]],
        password: ["", Validators.required],
        isDriver: [false]
      });
      switcher.LangChange(this.translate);
  }

  ngOnInit() {
    switcher.LangChange(this.translate);
    this.loginForm.controls['userName'].patchValue(null)
    this.loginForm.controls['password'].patchValue(null)
    localStorage.removeItem('Bo_token');
    localStorage.removeItem('Bo_Refreshtoken');
    localStorage.removeItem('roles');
    Swal.close();
    
  }

  showPassword() {
    this.show = !this.show;
  }

  // Simple Login
  login() {
    this.showLoader = true 
    this.showLoader = this.authService.SignIn(this.loginForm.value);
  }

}
