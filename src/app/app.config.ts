import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { apolloGraphqlProvider } from '../../apollo.provider';

import { ExplorerEffects } from './explorer/store/explorer.effects';
import { explorerReducer } from './explorer/store/explorer.reducer';

import { explorerTokenInterceptor } from './explorer/utils/explorer-token.interceptor';
import { explorerErrorInterceptor } from './explorer/utils/explorer-error.interceptor';

import { routes } from './app.routes';

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
  ],
};
