import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanySettingsDto, SettingData } from './SettingDto';
import { Configuration } from './config';
import { Observable, Subject } from 'rxjs';
import { SettingEnum } from './enums';
import { TranslateService } from '@ngx-translate/core';
import { GenericResponse } from './genericResponse.service';
import { ArchiveTypeDto } from 'src/app/shared/common/archive-type-dto';
import { CreateFileInfoDto } from './sftp-dto';
import { AutoCompleteResponseDto } from './AutoCompleteResponseDto';

@Injectable({
  providedIn: 'root'
})
export class SettingApiService {

  public Listmarket: SettingData[] = []
  public Listcurrency: SettingData[] = []
  public Listtransaction: SettingData[] = []
  public Listsymbol: SettingData[] = [];

  constructor(private _http: HttpClient, private Trans: TranslateService) { }


  getSettings(parm: SettingEnum): Observable<SettingData[]> {
    let response = this._http.get<SettingData[]>(Configuration.APIs.Setting.SettingApi + parm);
    return response;
  }
  getCompnayMarginSettings(): Observable<GenericResponse<CompanySettingsDto[]>> {

    let response = this._http.get<GenericResponse<CompanySettingsDto[]>>(Configuration.APIs.Setting.GetComapnyMarginSettings);
    return response;
  }

  CallCardSettingsAsSubject() {

    if (this.Listmarket.length > 0) return;
    let values = [SettingEnum.Market, SettingEnum.Transaction, SettingEnum.SymbolType, SettingEnum.Currency]
    values.forEach(parm => {
      this.getSettings(parm).subscribe((data) => {
        switch (parm) {
          case SettingEnum.Market:
            this.Listmarket = data
            break;
          case SettingEnum.Transaction:
            this.Listtransaction = data
            break;
          case SettingEnum.SymbolType:
            this.Listsymbol = data
            break;

          case SettingEnum.Currency:
            this.Listcurrency = data
            break;
        }
      })
    });
  }

  // Archive Types
  getArchiveTypes(): Observable<GenericResponse<ArchiveTypeDto[]>> {
    let response = this._http.get<GenericResponse<ArchiveTypeDto[]>>(Configuration.APIs.Setting.getArchiveTypes);
    return response;
  }

  createOrUpdateArchiveType(request: ArchiveTypeDto): Observable<GenericResponse<ArchiveTypeDto>> {
    let response = this._http.post<GenericResponse<ArchiveTypeDto>>(
      Configuration.APIs.Setting.createOrUpdateArchiveType, (request));
    return response;
  }

  deleteArchiveType(ID: number): Observable<GenericResponse<void>> {
    let response = this._http.delete<GenericResponse<void>>(Configuration.APIs.Setting.deleteArchiveType + ID);
    return response;
  }

  // SFTP APIs
  uploadFile(request: CreateFileInfoDto, files: any): Observable<GenericResponse<string>> {
    const formData = new FormData();
    for (let index = 0; index < files.length; index++) {
      formData.append('Files', files[index]);
    }
    var parm = "?RelationCode=" + request.relationCode + "&FileType=" + request.archiveTypeID;
    let response = this._http.post<GenericResponse<string>>(
      Configuration.APIs.Setting.uploadFile + parm, formData
    );
    return response;
  }

  deleteFile(archiveId: number): Observable<GenericResponse<void>> {
    let response = this._http.delete<GenericResponse<void>>(Configuration.APIs.Setting.deleteFile + archiveId);
    return response;
  }
  downloadFile(archiveId: number): Observable<any> {
    let options_: any = {
      responseType: "blob",
    };
    let response = this._http.get<any>(Configuration.APIs.Setting.downloadFile + archiveId, options_);
    return response;
  }

  getCityByGovId(govId: number): Observable<any> {
    let response = this._http.get<any>(Configuration.APIs.Setting.cityByGov + govId);
    return response;
  }


  enumToArray(data: any, enumname: string): any {
    var output: any = []
    Object.keys(data)
      .filter(key => isNaN(Number(key)))
      .map(index => {
        let result = data[index];
        output.push({ id: result, name: this.Trans.instant(enumname + index) })
      });
    return output;
  }

  autoCompleteData(query: string) {
    let response = this._http.get<AutoCompleteResponseDto[]>(Configuration.APIs.Setting.autoComplete + query);
    return response;
  }
}
