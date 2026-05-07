import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appToggleTheme]'
})
export class ToggleThemeDirective {
  private body:any = document.querySelector('body');
  constructor() { }

  @HostListener('click') toggleTheme(){
    if (this.body != !this.body) {
      if (this.body.classList.contains('dark-theme')) {
        this.body.classList.remove('dark-theme');
        this.body.classList.add('light-theme');
        localStorage.setItem('currentTheme', 'light');
      } else {
        this.body.classList.add('dark-theme');
        this.body.classList.remove('light-theme');
        localStorage.setItem('currentTheme', 'dark');
      }
    }
  }
}
