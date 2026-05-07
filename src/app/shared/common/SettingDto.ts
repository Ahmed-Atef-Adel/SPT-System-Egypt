

export interface SettingData {
    nameAr: string
    nameEn : string
    id: number 
    value: string
    otherValue: string
    
}

export interface ExternalEinvoiceDetailsDto {
    id: number 
    amount: number 
    commsionId: number
    externalEInvoicesId: number
    nameAr:string, 
    nameEn :string 
}


export interface CompanySettingsDto {
    settingname: string
    settingValue : string
}