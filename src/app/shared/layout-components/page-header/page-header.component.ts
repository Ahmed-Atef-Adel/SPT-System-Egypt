import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  @Input() title!: string;
  @Input() items!: any[];
  @Input() active_item!: string;
  parentUrlName: any
  constructor(private route: Router, private activeRoute: ActivatedRoute, private translate: TranslateService) { }

  ngOnInit(): void {
  }

  routeUrl(item: any) {
    this.activeRoute.parent?.data.subscribe((data: any) => {
      this.parentUrlName = data.parentData;
      //console.log(this.activeRoute.routeConfig?.path , this.route.url.endsWith(this.activeRoute.routeConfig?.path ?? ''), this.route.url ,this.route);

    });
    if (this.active_item != this.translate.instant('Dashboard') && this.parentUrlName != undefined) {
      this.route.navigate(['/' + this.parentUrlName + '/' + 'Home'])
    }
    else if (this.route.url.startsWith('/reports')) {
      this.route.navigate(['/module-selection'])
    }
    else {
      this.route.navigate(['/module-selection'])
    }
  }
}
