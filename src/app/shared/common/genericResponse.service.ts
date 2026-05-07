export interface GenericResponse<T>  {
  resultMessage : string  ,
  exception : string  ,
  resultObject : T ,
  crudOprationStatus : EumResponceStatus , 
  status : number,
  isCompletedSuccessfully: boolean, 
}

export interface PaginatorDto<T>  {
  resualt : T  ,
  rowCount: number,
}



export enum EumResponceStatus {
  Success = 0,
  Failure = 1,  
  Warning = 2
}

export interface ValidationFailure {
  propertyName : string ,
  errorMessage : string ,
  attemptedValue : string ,
}
