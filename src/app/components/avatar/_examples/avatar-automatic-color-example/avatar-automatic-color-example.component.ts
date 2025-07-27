import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  AvatarComponent,
  AvatarGroupComponent,
  AvatarMoreComponent,
} from '@elementar-ui/components/avatar';

@Component({
  selector: 'app-avatar-automatic-color-example',
  imports: [
    MatIcon,
    AvatarComponent,
    AvatarGroupComponent,
    AvatarMoreComponent
  ],
  templateUrl: './avatar-automatic-color-example.component.html',
  styleUrl: './avatar-automatic-color-example.component.scss'
})
export class AvatarAutomaticColorExampleComponent {

}
