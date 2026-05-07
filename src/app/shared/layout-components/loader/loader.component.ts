import { Component, OnInit, Input, Inject  , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router , NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event as NavigationEvent} from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { LoaderService } from '../../services/loader.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  public showLoader: boolean = false;
  public isSpinnerVisible = true;

  
  constructor( private router: Router ,private  loaderService : LoaderService ,   private _spinner: NgxSpinnerService  ) { 
    this.loaderService.isLoading.subscribe(x=> 
      {
        if(x)
        this._spinner.show() 
        else 
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this._spinner.hide();
        });
      })
    this.router.events.subscribe({
      next: (event:NavigationEvent) => {
        if (event instanceof NavigationStart) {
          this.isSpinnerVisible = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
          ){
            this.isSpinnerVisible = false;
        }
      },
      error: (e) => this.isSpinnerVisible = false
    })
  }
  ngOnInit(): void {}
  
}
