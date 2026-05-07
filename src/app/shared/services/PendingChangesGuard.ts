import { CanDeactivateFn, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

// Full solution found here: https://stackoverflow.com/a/41187919/74276
// and then changed to use the function-based method of doing route guards
// Updated solution found here: https://stackoverflow.com/a/75769104/74276

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

export const PendingChangesGuard: CanDeactivateFn<ComponentCanDeactivate> = (
  component: ComponentCanDeactivate
): Observable<boolean | UrlTree> => {

  return new Observable<boolean | UrlTree>((obs) => {
     return component.canDeactivate() ?  obs.next(true)  :obs.next(true) 
    //  obs.next( localStorage.getItem("Bo_token") == null  ? true :
    //   confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.'));
  });
};


 // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
        // when navigating away from your angular app, the browser will show a generic warning message
        // see http://stackoverflow.com/a/42207299/7307355