import { Component } from '@angular/core';

// DEPRECATED
@Component({
  selector: 'emr-avatar-total,[emr-avatar-total]',
  exportAs: 'emrAvatarTotal',
  standalone: true,
  templateUrl: './avatar-total.component.html',
  styleUrl: './avatar-total.component.scss',
  host: {
    'class': 'emr-avatar-total'
  }
})
export class AvatarTotalComponent {
}
