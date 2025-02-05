import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { DEFAULT_INITIAL_EXPLORER_STATE } from '../../__mocks__/explorer.mocks';

import { ExplorerAction } from '../explorer/store/explorer.actions';

import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent],
      providers: [provideRouter([]), provideMockStore({ initialState: DEFAULT_INITIAL_EXPLORER_STATE })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('handling reset token works', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();

    component.resetToken();

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: ExplorerAction.ResetToken,
    });
  });
});
