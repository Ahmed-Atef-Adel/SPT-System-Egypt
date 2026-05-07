import { Component, Inject, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { config, fromEvent } from 'rxjs';
import { LangChange } from './shared/layout-components/switcher/switcher';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Language, LanguageService } from './shared/services/language.service';

import * as moment from 'moment';
 
import { Configuration } from './shared/common/config';
import { AuthService } from './shared/guard/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public translate: TranslateService ) {
    window.sessionStorage.clear()
    const langservice = new LanguageService(translate);
    translate.addLangs([Language.en, Language.ar]);
    let body = document.querySelector('body');
    let html = document.querySelector('html');
    let styleId = document.querySelector('#style');
    let currentLanguage = localStorage?.getItem('currentLang') ?? 'en'
    translate.setDefaultLang(currentLanguage)
    langservice.updateCurrentLang(currentLanguage === 'en' ? Language.en : Language.ar)
    langservice.updateDirection();

    body?.classList.add(langservice.direction.getValue());
    html?.setAttribute('dir', langservice.direction.getValue());
    if (langservice.direction.getValue() == 'rtl') {
      body?.classList.remove('ltr');
    } else if (langservice.direction.getValue() == 'ltr') {
      body?.classList.remove('rtl');
    }

    var theme = localStorage.getItem('currentTheme') ?? 'light'
    if (theme === 'transparent') {
      document.querySelector('body')?.classList.add('transparent-theme');
      document.querySelector('body')?.classList.remove('light-theme');
      document.querySelector('body')?.classList.remove('dark-theme');
      document.querySelector('body')?.classList.remove('bg-img1');
      document.querySelector('body')?.classList.remove('bg-img2');
      document.querySelector('body')?.classList.remove('bg-img3');
      document.querySelector('body')?.classList.remove('bg-img4');
      body?.classList.remove('light-menu');
      body?.classList.remove('color-menu');
      body?.classList.remove('dark-menu');
      body?.classList.remove('gradient-menu');
      body?.classList.remove('light-header');
      body?.classList.remove('color-header');
      body?.classList.remove('gradient-header');
      body?.classList.remove('dark-header');
    }

    else if (theme === 'light') {
      document.querySelector('body')?.classList.add('light-theme');
      document.querySelector('body')?.classList.remove('dark-theme');
      document.querySelector('body')?.classList.remove('transparent-theme');
      document.querySelector('body')?.classList.remove('bg-img1');
      document.querySelector('body')?.classList.remove('bg-img2');
      document.querySelector('body')?.classList.remove('bg-img3');
      document.querySelector('body')?.classList.remove('bg-img4');
    }
    else {
      document.querySelector('body')?.classList.add('dark-theme');
      document.querySelector('body')?.classList.remove('light-theme');
      document.querySelector('body')?.classList.remove('transparent-theme');
      document.querySelector('body')?.classList.remove('bg-img1');
      document.querySelector('body')?.classList.remove('bg-img2');
      document.querySelector('body')?.classList.remove('bg-img3');
      document.querySelector('body')?.classList.remove('bg-img4');
    }
  }

  ngOnInit() {
    fromEvent(window, 'load').subscribe(() => document.querySelector('#glb-loader')?.classList.remove('loaderShow'));

  }

  


}
