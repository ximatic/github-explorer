import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TranslatePipe } from '@ngx-translate/core';
import { PanelModule } from 'primeng/panel';

import { Repository } from '../../models/explorer.model';

@Component({
  selector: 'app-repository-info',
  templateUrl: './repository-info.component.html',
  styleUrl: './repository-info.component.scss',
  imports: [CommonModule, TranslatePipe, PanelModule],
})
export class RepositoryInfoComponent {
  @Input() repository!: Repository;
}
