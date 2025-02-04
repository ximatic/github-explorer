import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

import { catchError, Observable, throwError } from 'rxjs';

export const explorerErrorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // TODO - improve error handling
      console.error('explorerErrorInterceptor | error:', error);
      return throwError(() => error);
    }),
  );
};
