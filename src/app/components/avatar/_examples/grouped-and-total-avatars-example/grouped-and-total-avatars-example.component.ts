import { Component } from '@angular/core';
import {
  AvatarComponent,
  AvatarGroupComponent,
  AvatarMoreComponent,
  DicebearComponent
} from '@elementar-ui/components/avatar';

@Component({
  selector: 'app-grouped-and-total-avatars-example',
  templateUrl: './grouped-and-total-avatars-example.component.html',
  imports: [
    AvatarComponent,
    AvatarGroupComponent,
    AvatarMoreComponent,
    DicebearComponent
  ],
  styleUrl: './grouped-and-total-avatars-example.component.scss'
})
export class GroupedAndTotalAvatarsExampleComponent {

}
