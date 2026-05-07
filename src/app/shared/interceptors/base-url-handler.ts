import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, finalize, map, switchMap, take, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EumResponceStatus, GenericResponse } from '../common/genericResponse.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../guard/auth.service';
import { Urls } from '../models/Urls';


export const securityAPI = new HttpContextToken(() => false);
@Injectable()
export class BaseURlHandlerInterceptor implements HttpInterceptor {
  [x: string]: any;
  private isRefreshing = false;
  private tokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private translate: TranslateService, private authService: AuthService) { }
  counter = 0;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const BaseURL: any = Urls.baseUrl;

   if (!req.url.includes('i18n')) {
        if (req.url) {
          if (this.authService.getToken() != undefined)
            req = req.clone({
              url: BaseURL + req.url,
              headers: req.headers.set('Authorization', `Bearer ${this.authService.getToken()}`)
              //  .set('Accept-Language', "en")
            });
          else
            req = req.clone({ url: BaseURL + req.url });
        }
      }

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (!req.url.includes('i18n')) {
          if (event instanceof HttpResponse) {
            let responseBody = event.body as GenericResponse<object>;
            if (responseBody?.isCompletedSuccessfully == false) {
              let mess = ""
              if (responseBody?.exception.includes(":")) {
                responseBody?.exception?.split(":").forEach(c => mess += this.translate.instant(c.trim()));
              }
              else {
                mess = this.translate.instant(responseBody?.exception);
              }

              alert
              Swal.fire({
                icon: 'error',
                title: 'Trips',
                text: mess,
                timer: 15000,
                timerProgressBar: true,
              })
            }

            else if (responseBody?.isCompletedSuccessfully == true && responseBody?.resultMessage != null)
              Swal.fire({
                icon: responseBody?.crudOprationStatus == EumResponceStatus.Warning ? 'warning' : 'success',
                title: 'Trips',
                text: responseBody?.resultMessage != undefined
                  ? this.translate.instant(responseBody?.resultMessage)
                  : this.translate.instant('EumResponceStatus.Success'),
                timer: 15000,
                timerProgressBar: true,
              })
          }
        }
        return event;
      }),
      catchError((error: any) => {
        if (error.status == 400 || error.status == 405)
          Swal.fire('Trips', error.error.exception != undefined ?
            this.translate.instant(error.error.exception) :
            this.translate.instant("error.Not_Valid_Parm"), 'error');
        else if (error.status == 401)
          return this.handle401Error(req, next);
        else if (error.status == 500)
          Swal.fire('Trips', this.translate.instant(error.exception), 'error');
        else if (error.statusText != undefined || error.statusText != null)
          Swal.fire('Trips', "Server Error", 'error');
        return throwError(() => error.statusText);
      })
    );
  }


  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);
      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          console.log('updating on 401');
          if (token.accessToken != null) {
            localStorage.setItem('Bo_token', token.accessToken);
            localStorage.setItem('Bo_Refreshtoken', token.refreshToken);
            console.log(" token.refreshToken", token.refreshToken)
          }
          else {
            this.isRefreshing = false;
            console.log("Token Is Null" , token);
            this.authService.SignOut();
          }
          return next.handle(
            this.addTokenInHeader(request, token.accessToken)
          );
        }),
        catchError((error) => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          this.isRefreshing = false;
          console.log("Token Is Null",error);
          this.authService.SignOut();
          return throwError('');
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      return this.tokenSubject.pipe(
        filter((token) => token.accessToken != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addTokenInHeader(request, token));
        })
      );
    }
  }


  addTokenInHeader(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: 'Bearer ' + token }
    });
  }
}

