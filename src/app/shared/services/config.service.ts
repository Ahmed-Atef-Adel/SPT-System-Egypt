import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Urls } from '../models/Urls';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = "../../../assets/config.json"
  config: {
    baseUrl: string,
    ws: string,
    Reports: string,
    FeedURL: string
  } = { baseUrl: "", ws: "", Reports: "", FeedURL: "" }
  constructor(private http: HttpClient) {
    this.getUrl();
  }

  Init() {
    return new Promise<void>((resolve, reject) => {
      this.http.get(this.configUrl).subscribe((res: any) => {
        Urls.baseUrl = res["baseURL"]
           
          resolve();
      })
    });
  }

  getUrl() {
    this.http.get(this.configUrl).subscribe((res: any) => {
      this.config.baseUrl = res["baseURL"]
    })
  }
}
