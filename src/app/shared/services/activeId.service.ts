import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
// navigation of client 
export class ActiveIdService {
  private activeIdSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  activeId$ = this.activeIdSubject.asObservable();
  private previousUrl!: string;
  constructor(private router: Router, private route: ActivatedRoute) {
    if (this.route.snapshot.queryParamMap.keys.length == 0) {
      localStorage.setItem('activeId', "0");
    }
    const storedId = localStorage.getItem('activeId');
    if (storedId) {
      this.activeIdSubject.next(parseInt(storedId, 10));
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.previousUrl == undefined) {
          this.previousUrl = event.url
        }
        const currentUrl = this.router.url;
        // Check if navigating to another page (not on refresh)
        if (this.previousUrl !== currentUrl) {
          this.updateActiveId(0); // Set the value back to 0
        }
        this.previousUrl = currentUrl
      }
    });
  }
  updateActiveId(id: number) {
    this.activeIdSubject.next(id);
    localStorage.setItem('activeId', id.toString());
  }
}