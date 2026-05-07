import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';


export enum Direction {
  ltr = 'ltr', rtl = "rtl"
}

export enum Language {
  ar = "ar", en = "en"
}

@Injectable()
export class LanguageService {
  direction: BehaviorSubject<string> = new BehaviorSubject<string>(localStorage.getItem('currentDirection') ?? 'ltr')
  currentLang: BehaviorSubject<Language> = new BehaviorSubject<Language>(Language.ar)
  translation: BehaviorSubject<any> = new BehaviorSubject<any>({})
  constructor(private translate: TranslateService) {

  }

  // update
  public updateDirection(): void {
    this.translate.stream("direction").subscribe((dir: Direction) => {
      localStorage.setItem('currentDirection', dir);
      this.direction.next(dir)
    })
  }
  public updateCurrentLang(lang: Language): void {
    localStorage.setItem('currentLang', lang);
    this.translate.use(lang);
    this.currentLang.next(lang);
  }
  public updateTranslation(): void {
    this.translate.onLangChange.subscribe((res: any) => {
      this.translation.next(res)
    })
  }

  // observe
  observeDirection(): Observable<string> {
    return this.direction.asObservable()
  }
  observeCurrentLang(): Observable<Language> {
    return this.currentLang.asObservable()
  }
  observeTranslation(): Observable<any> {
    return this.translation.asObservable()
  }
}
