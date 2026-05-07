import { Component, OnInit } from '@angular/core';
import { SwitcherService } from 'src/app/shared/services/switcher.service';
@Component({
  selector: 'app-loans-layout',
  templateUrl: './loans-layout.component.html',
  styleUrls: ['./loans-layout.component.scss']
})
export class LoansLayoutComponent implements OnInit {

  constructor(public SwitcherService: SwitcherService) { }

  ngOnInit(): void {
  }

  toggleSwitcherBody() {
    this.SwitcherService.emitChange(false);
  }
}
