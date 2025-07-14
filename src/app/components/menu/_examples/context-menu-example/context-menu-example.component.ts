import { Component } from '@angular/core';
import { MatContextMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-context-menu-example',
  imports: [
    MatIcon,
    MatMenuItem,
    MatContextMenuTrigger,
    MatMenu
  ],
  templateUrl: './context-menu-example.component.html',
  styleUrl: './context-menu-example.component.scss'
})
export class ContextMenuExampleComponent {

}
