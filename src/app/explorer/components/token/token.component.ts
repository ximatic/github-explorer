import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { Observable, skip, Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';

import { explorerActions } from '../../store/explorer.actions';
import { selectExplorerToken } from '../../store/explorer.selectors';
import { ExplorerState } from '../../store/explorer.state';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrl: './token.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonModule, FloatLabelModule, InputTextModule, PanelModule],
})
export class TokenComponent implements OnInit, OnDestroy {
  // ngrx
  token$!: Observable<string | null>;

  // state flags
  isInvalidToken = false;
  isSubmitInProgress = false;

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

  // initialization

  private init(): void {
    this.initState();
    this.initForm();
  }

  private initState(): void {
    this.store.dispatch(explorerActions.reset());
    // reset Apollo's cache as new API Token will be used
    this.apollo.client.clearStore();

    this.token$ = this.store.select(selectExplorerToken);
    this.subscription.add(
      this.token$.pipe(skip(1)).subscribe((token: string | null) => {
        this.isSubmitInProgress = false;
        if (token) {
          this.isInvalidToken = false;
          this.router.navigate(['/repositories']);
        } else {
          this.isInvalidToken = true;
        }
      }),
    );
  }

  // form

  submitForm(): void {
    if (this.apiForm.invalid) {
      return;
    }

    this.isSubmitInProgress = true;
    this.store.dispatch(explorerActions.tokenVerify({ token: this.tokenControl?.value }));
  }

  private initForm(): void {
    this.apiForm = this.formBuilder.group({
      token: ['', Validators.required],
    });
  }
}
