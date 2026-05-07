export enum SettingEnum {
    Nationalities = 1,
    Branches = 2,
    AccountManger = 3,
    Referral = 4,
    clientType = 5,
    clientClass = 6,
    Government = 7,
    APPSubscribeData = 8,
    Custodian = 9,
    Currency = 10,
    Market = 11,
    Symbol = 12,
    Transaction = 13,
    SymbolType = 14,
    MarginCustodian = 15,
    MarginCategory = 16,
    EinvoiceCommission = 17,
    CustodianGLAccount = 18,
    MainMarket = 19,
    Job = 20,
    Department = 21,
    Role = 22,
    BankAccount = 23,
    BrokerGLAccount = 30,
    Accounts = 31
}

export enum ApiClientSearchFilter {
    NameOrCode = 1,
    mobile,
    Email,
    NationalId,
    UnifiedCode,
    ExchangeCode,
    MainAccount
}

export enum RegistrationEnum {
    New = 1,
    Approved = 2,
    AmendmentRequired = 3,
    Rejected = 4
}

export enum ActionTypeEnum {
    FilterByContent = 1,
    FilterByNoContent = 2,
    FilterByEndWith = 3,
    FilterByStartWith = 4,
    FilterByEqual = 5,
    FilterByNoEqual = 6,
    GraterThan = 7,
    LessThan = 8,
    GraterThanOrEqual = 9,
    LessThanOrEqual = 10,
}
export enum SortTypeEnum {
    OrderByDESC = 2,
    OrderByASC = 1,
}
