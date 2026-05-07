export class CustomOptionsDto
{
      PropertyName :any;
      ActionType :any;
      ActionValue :any;


}
export class CustomFilterOptionsDto
{
    Options :CustomOptionsDto[];
    SortPropertyName :any;
    SortType :any;
    Skip :any;
    Take :any;
    TakeAll :any;

}