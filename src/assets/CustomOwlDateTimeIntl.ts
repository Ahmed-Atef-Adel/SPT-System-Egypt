import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OwlDateTimeIntl } from 'ng-pick-datetime';

@Injectable()
export class CustomOwlDateTimeIntl extends OwlDateTimeIntl {

    constructor(private translate: TranslateService) {
        super();
    }
    /** A label for the date time input field. */
    public override readonly cancelBtnLabel = this.translate.instant('client.Cancel');

    /** A label for the set button */
    public override readonly setBtnLabel = this.translate.instant('client.Set');
}
