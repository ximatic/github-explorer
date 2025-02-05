import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideStore, Store } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { skip } from 'rxjs';

import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { apolloGraphqlProvider } from '../../apollo.provider';

import { ExplorerService } from './explorer/services/explorer.service';

import { explorerActions } from './explorer/store/explorer.actions';
import { ExplorerEffects } from './explorer/store/explorer.effects';
import { selectExplorerToken } from './explorer/store/explorer.selectors';
import { ExplorerState } from './explorer/store/explorer.state';
import { explorerReducer } from './explorer/store/explorer.reducer';

import { explorerTokenInterceptor } from './explorer/utils/explorer-token.interceptor';
import { explorerErrorInterceptor } from './explorer/utils/explorer-error.interceptor';

import { routes } from './app.routes';

import { DEFAULT_LANGUAGE } from './explorer/constants/explorer.const';

export const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');

function initializeApplication(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const store = inject(Store<ExplorerState>);
    const explorerService = inject(ExplorerService);
    const token = explorerService.loadToken();
    if (!token) {
      resolve(true);
    }

    store.dispatch(explorerActions.tokenVerify({ token }));

    store
      .select(selectExplorerToken)
      .pipe(skip(1))
      .subscribe(() => {
        resolve(true);
      });
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([explorerTokenInterceptor, explorerErrorInterceptor])),
    // NgRx
    provideEffects([ExplorerEffects]),
    provideStore({
      explorer: explorerReducer,
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    // ngx-translate
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: DEFAULT_LANGUAGE,
      useDefaultLang: true,
    }),
    // Apollo
    apolloGraphqlProvider,
    // PrimeNG
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark-mode',
        },
      },
    }),
    // other
    provideAppInitializer(initializeApplication),
  ],
};
