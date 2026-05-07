import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { finalize, map, Observable, tap } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoaderHandlerInterceptor implements HttpInterceptor {
  constructor(private _loaderService: LoaderService) {}
  counter: number = 0;
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.counter++;
    this._loaderService.show();
    return next.handle(req).pipe(
      finalize(() => {
        this.counter--;
        if (this.counter == 0) {
          this._loaderService.hide();
        }
      })
    );
  }
}
