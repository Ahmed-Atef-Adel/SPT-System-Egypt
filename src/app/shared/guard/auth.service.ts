import { Injectable, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
// import { auth } from 'firebase/app';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { GenericResponse } from '../common/genericResponse.service';
import { Configuration } from '../common/config';
import { AuthenticateModel, TokenModel } from './AuthenticateResultModel';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { Observable, finalize, map } from 'rxjs';
 
import { AES } from 'crypto-js';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
 

@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnInit {
  returnUrl: any
  userRoles: string[] = []
  constructor(public jwtHelper: JwtHelperService,
    private _router: Router, private http: HttpClient,
 
    private translate: TranslateService) {
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('Bo_token');
    return !this.jwtHelper.isTokenExpired(token);
  }
  ngOnInit(): void {

  }

  // Sign in function
  SignIn(authenticateModel: AuthenticateModel) {
    if (authenticateModel.isDriver) {
         this._router.navigate(['/driver-app'])
    }
    else 
             this._router.navigate(['/module-selection'])
    // let response = this.http.post<any>(Configuration.APIs.account.login, authenticateModel);
    // response.subscribe((result: any) => {
    //   if (result.accessToken != null)
    //     this.processAuthenticateResult(result, true);
    // })
      return false
  }

  tryRefreshingTokens() {
    const token = localStorage.getItem('Bo_token');
    let result = true
    const refreshToken = localStorage.getItem("Bo_Refreshtoken");
    if (!token || !refreshToken) {
      this._router.navigate(['/auth/login'])
      result = false
    }
    const credentials = { accessToken: token, refreshToken: refreshToken };
    let response = this.http.post<TokenModel>(Configuration.APIs.account.RefreshToken, credentials);

    response.subscribe((data: TokenModel) => {
      if (data.accessToken != null && data.refreshToken != null) {
        localStorage.setItem('Bo_token', data.accessToken);
        localStorage.setItem('Bo_Refreshtoken', data.refreshToken);
        console.log('Bo_Refreshtoken', data.refreshToken)
      }
      else {
        this.SignOut();
      }
    }
      , (err => { result = false })
    )

    return result
  }

  refreshToken() {
    const token = localStorage.getItem('Bo_token');
    const refreshToken = localStorage.getItem("Bo_Refreshtoken");
    const credentials = { accessToken: token, refreshToken: refreshToken };
    return this.http.post<TokenModel>(Configuration.APIs.account.RefreshToken, credentials);
  }
  



  public getUserName() {
   return "Admin";

    // let val = localStorage.getItem('Bo_token')?.toString() ?? "";
    // if (val == "") {
    //   localStorage.removeItem('Bo_token');
    //   this.SignOut();
    // }
    // let values = this.jwtHelper.decodeToken(val)
    // return values.Name;
  }

  public getUserId() {
    return 1 ; 
    // let val = localStorage.getItem('Bo_token')?.toString() ?? "";
    // let values = this.jwtHelper.decodeToken(val)
    // if (values == null)
    //   return 0
    // else
    //   return Number(values.UserId);
  }

  public getRoleId() {
    let val = localStorage.getItem('Bo_token')?.toString() ?? "";
    let values = this.jwtHelper.decodeToken(val)
    if (values == null)
      return 0
    else
      return Number(values.RoleId);
  }

  public getIsAdmin() {

    let val = localStorage.getItem('Bo_token')?.toString() ?? "";
    let values = this.jwtHelper.decodeToken(val)
    return values.Admin == 1;
  }

  public getUserBranch() {
    let val = localStorage.getItem('Bo_token')?.toString() ?? "";
    let values = this.jwtHelper.decodeToken(val)
    return values.BranchName;
  }

  processAuthenticateResult(authenticateResult: any, executeRoute: boolean) {
    if (authenticateResult.accessToken) {
      localStorage.setItem('Bo_token', authenticateResult.accessToken ?? "");
      localStorage.setItem('Bo_Refreshtoken', authenticateResult.refreshToken ?? "");

      if (executeRoute) {
        
        if (this.returnUrl == undefined)
          this._router.navigate(['/module-selection'])
        else
          this._router.navigate([this.returnUrl])
      }
    } else {
      Swal.fire('Trips', this.translate.instant(authenticateResult.exception), "error");
      this.SignOut();
    }
  }

 

  // Sign out
  SignOut() {
    this._router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this._router.navigate(['/auth/login'])
  }

  getToken(): string | undefined {
    return localStorage.getItem('Bo_token') ?? undefined
  }

  isGranted(permission: string): boolean {
    if (this.getIsAdmin())
      return true;
    else {
      let encryptedUserRolesString = localStorage.getItem('roles')
      let encryptedUserRoles: string[] = encryptedUserRolesString ? JSON.parse(encryptedUserRolesString) : []
      let encryptionKey = 'Trips'
      return encryptedUserRoles.map((role: string) => this.decryptValue(role, encryptionKey)).includes(permission)
    }
  }

  decryptValue(encryptedValue: any, encryptionKey: any) {
    const encryptedBytes = AES.decrypt(encryptedValue, encryptionKey);
    return encryptedBytes.toString(CryptoJS.enc.Utf8);
  }

  encryptValue(plainText: any, encryptionKey: any) {
    var encryptedBytes = AES.encrypt(plainText, encryptionKey)
    return encryptedBytes.toString();
  }

}