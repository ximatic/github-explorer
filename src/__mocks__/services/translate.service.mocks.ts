/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { EventEmitter } from '@angular/core';

import { Observable, of } from 'rxjs';

export const translateServiceMock: {
  use: jest.Mock;
  get: () => Observable<any>;
  instant: (key: any, interpolateParams?: any) => any;
  onTranslationChange: EventEmitter<any>;
  onLangChange: EventEmitter<any>;
  onDefaultLangChange: EventEmitter<any>;
} = {
  use: jest.fn(),
  get: () => of(null),
  instant: (key: any, interpolateParams?: any) => key,
  onTranslationChange: new EventEmitter<any>(),
  onLangChange: new EventEmitter<any>(),
  onDefaultLangChange: new EventEmitter<any>(),
};
