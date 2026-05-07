

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
  
})
export class SortService {

 compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

   getPropertyByName<T>(propertyName: keyof T, obj: T): T[keyof T] {
    return obj[propertyName];
  }

  
}