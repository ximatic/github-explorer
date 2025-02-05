import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideTranslateService } from '@ngx-translate/core';

import { RepositoryInfoComponent } from './repository-info.component';

describe('RepositoryInfoComponent', () => {
  let component: RepositoryInfoComponent;
  let fixture: ComponentFixture<RepositoryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryInfoComponent],
      providers: [provideAnimationsAsync(), provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryInfoComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
