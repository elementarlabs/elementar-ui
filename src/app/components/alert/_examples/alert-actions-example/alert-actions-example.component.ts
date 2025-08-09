import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  AlertActionDirective,
  AlertCloseDirective,
  AlertComponent,
  AlertTitleDirective
} from '@elementar-ui/components/alert';
import { MatButton, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-alert-actions-example',
  imports: [
    MatIcon,
    AlertActionDirective,
    AlertCloseDirective,
    AlertComponent,
    AlertTitleDirective,
    MatIconButton,
    MatButton
  ],
  templateUrl: './alert-actions-example.component.html',
  styleUrl: './alert-actions-example.component.scss'
})
export class AlertActionsExampleComponent {

}
