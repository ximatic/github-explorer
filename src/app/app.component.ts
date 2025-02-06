import { Component } from '@angular/core';

import { MainComponent } from './main/main.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [MainComponent],
})
export class AppComponent {}
