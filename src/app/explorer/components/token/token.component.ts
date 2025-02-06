import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Observable, skip, Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';

import { explorerActions } from '../../store/explorer.actions';
import { ExplorerError } from '../../store/explorer.errors';
import { selectExplorerError, selectExplorerToken } from '../../store/explorer.selectors';
import { ExplorerState } from '../../store/explorer.state';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrl: './token.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    // Angular imports
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    // 3rd party imports
    TranslatePipe,
    ButtonModule,
    CheckboxModule,
    FloatLabelModule,
    InputTextModule,
    PanelModule,
  ],
})
export class TokenComponent implements OnInit, OnDestroy {
  // ngrx
  error$!: Observable<ExplorerError | null>;
  token$!: Observable<string | null>;

  // state flags
  isInvalidToken = signal(false);
  isSubmitInProgress = signal(false);

  // form
  apiForm!: FormGroup;

  // other
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private store: Store<ExplorerState>,
    private apollo: Apollo,
  ) {}

  // lifecycle methods

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // controls

  get tokenControl(): AbstractControl | null {
    return this.apiForm.get('token');
  }

  get storeTokenControl(): AbstractControl | null {
    return this.apiForm.get('storeToken');
  }

  // initialization

  private init(): void {
    this.initState();
    this.initForm();
  }

  private initState(): void {
    // reset Apollo's cache as new API Token will be used
    this.apollo.client.clearStore();

    this.error$ = this.store.select(selectExplorerError);
    this.subscription.add(
      this.error$.pipe(skip(1)).subscribe((error: ExplorerError | null) => {
        if (error && error === ExplorerError.InvalidToken) {
          this.isSubmitInProgress.set(false);
          this.isInvalidToken.set(true);
        }
      }),
    );

    this.token$ = this.store.select(selectExplorerToken);
    this.subscription.add(
      this.token$.pipe(skip(1)).subscribe((token: string | null) => {
        this.isSubmitInProgress.set(false);
        if (token) {
          this.isInvalidToken.set(false);
          this.router.navigate(['/repositories']);
        }
      }),
    );
  }

  // form

  submitForm(): void {
    if (this.apiForm.invalid) {
      return;
    }

    this.isSubmitInProgress.set(true);
    this.isInvalidToken.set(false);
    this.store.dispatch(
      explorerActions.tokenVerify({ token: this.tokenControl?.value, storeToken: this.storeTokenControl?.value }),
    );
  }

  private initForm(): void {
    this.apiForm = this.formBuilder.group({
      token: ['', Validators.required],
      storeToken: [false],
    });
  }
}
