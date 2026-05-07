import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { LayoutService } from '../../services/layout.service';
import { NavService } from '../../services/nav.service';
import { SwitcherService } from '../../services/switcher.service';
import { AuthService } from '../../guard/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Language, LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],

})
export class HeaderComponent implements OnInit {
  private body: HTMLBodyElement | any = document.querySelector('body');
  private html: HTMLBodyElement | any = document.querySelector('html');
  private styleId: HTMLBodyElement | any = document.querySelector('#style');
  public isCollapsed = true;
  activated: boolean = false;
  @Input() hideClientSideBar : any
  @Input() hideReportsSideBar : any
  @Input() hideSuspensionsSideBar: any
  @Input() hideLoansSideBar: any
  constructor(
    private layoutService: LayoutService,
    public SwitcherService: SwitcherService,
    public navServices: NavService,
    public auth: AuthService,
    private router: Router,
    private modalService: NgbModal,
    public translate: TranslateService
  ) {
    const langservice = new LanguageService(translate);
    let currentLanguage = localStorage?.getItem('currentLang') ?? 'en'
    langservice.updateCurrentLang(currentLanguage === 'en' ? Language.en : Language.ar)
  }

  ngOnInit(): void {

  }
  toggleSwitcher() {
    this.SwitcherService.emitChange(true);
  }

  toggleSidebarNotification() {
    this.layoutService.emitSidebarNotifyChange(true);
  }

  signout() {
    this.auth.SignOut();
    this.router.navigate(['/auth/login']);
  }

  open(content: any) {
    this.modalService.open(content, {
      // backdrop: 'static',
      windowClass: 'modalCusSty',
    });
  }

  searchToggle() {
    if (this.body.classList.contains('search-open')) {
      this.activated = false;
      this.body.classList.remove('search-open')
    }
    else {
      this.activated = true;
      this.body.classList.add('search-open')
    }
  }
  closeToggle() {
    this.activated = false;
    this.body.classList.remove('search-open')
  }
  onEnglishLanguageClick(modal: any) {
    const langservice = new LanguageService(this.translate);
    langservice.updateCurrentLang(Language.en)
    langservice.updateTranslation();
    langservice.updateDirection();
    //add
    this.body?.classList.add('ltr');
    this.html?.setAttribute('dir', 'ltr');
    this.styleId?.setAttribute('href', './assets/bootstrap/bootstrap.css');
    //remove
    this.body?.classList.remove('rtl');
    modal.close();
    location.reload();
  }
  onArabicLanguageClick(modal: any) {
    const langservice = new LanguageService(this.translate);
    langservice.updateCurrentLang(Language.ar)
    langservice.updateTranslation();
    langservice.updateDirection();
    //add
    this.body?.classList.add('rtl');
    this.html?.setAttribute('dir', 'rtl');
    this.styleId?.setAttribute('href', './assets/bootstrap/bootstrap.rtl.css');
    //remove
    this.body?.classList.remove('ltr');
    modal.close();
    location.reload();
  }
}
