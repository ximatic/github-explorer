import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { PanelModule } from 'primeng/panel';

import { Repository } from '../../models/explorer.model';

@Component({
  selector: 'app-repository-info',
  templateUrl: './repository-info.component.html',
  styleUrl: './repository-info.component.scss',
  standalone: true,
  imports: [CommonModule, PanelModule],
})
export class RepositoryInfoComponent {
  @Input() repository!: Repository;
}
