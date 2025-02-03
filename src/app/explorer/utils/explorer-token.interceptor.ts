import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { mergeMap, Observable, take } from 'rxjs';

import { selectExplorerToken } from '../store/explorer.selectors';
import { ExplorerState } from '../store/explorer.state';

import { environment } from '../../../environments/environment';

interface IncludedUrl {
  url: string;
  method: string;
}

function isIncludedUrl(url: string, method: string): boolean {
  const includedUrls: IncludedUrl[] = [
    {
      url: environment.githubGraphQL,
      method: 'POST',
    },
  ];

  return (
    includedUrls.filter((includedUrl: IncludedUrl) => {
      return url.includes(includedUrl.url) && method === includedUrl.method;
    }).length > 0
  );
}

export const explorerTokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  if (!isIncludedUrl(request.url, request.method)) {
    return next(request);
  }

  const store = inject(Store<ExplorerState>);
  return store.select(selectExplorerToken).pipe(
    take(1),
    mergeMap((token: string | null) => {
      if (token) {
        request = request.clone({
          headers: request.headers.append('Authorization', `Bearer ${token}`),
        });
      }
      return next(request);
    }),
  );
};
