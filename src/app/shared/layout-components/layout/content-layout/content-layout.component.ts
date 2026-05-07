import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SwitcherService } from 'src/app/shared/services/switcher.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {
  layoutSub!: Subscription;
  sidenavtoggled1: any;
  hideClientSideBar: any
  hideReportsSideBar: any
  hideSuspensionsSideBar: any
  hideLoansSideBar: any
  constructor(public SwitcherService: SwitcherService, private route: Router) {
    this.hideReportsSideBar = this.route.url.startsWith('/reports');
    this.hideClientSideBar = this.route.url.startsWith('/client');
    this.hideSuspensionsSideBar = this.route.url.startsWith('/suspend');
    this.hideLoansSideBar = this.route.url.startsWith('/loans');
  }

  ngOnInit() {
  }

  toggleSwitcherBody() {
    this.SwitcherService.emitChange(false);
  }

}
