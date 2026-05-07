import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/guard/auth.service';
 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  constructor(public auth: AuthService , private translate : TranslateService) {
    this.translate.setDefaultLang(localStorage.getItem('currentLang') ?? 'en')
    this.translate.currentLang = localStorage.getItem('currentLang') ?? 'en'
   }

  ngOnInit(): void {
  }

  signOut() {
    this.auth.SignOut();
  }
}
