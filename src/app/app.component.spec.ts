import { TestBed } from '@angular/core/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { DEFAULT_INITIAL_EXPLORER_STATE } from '../__mocks__/explorer.mocks';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideMockStore({ initialState: DEFAULT_INITIAL_EXPLORER_STATE })],
    }).compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });
});
