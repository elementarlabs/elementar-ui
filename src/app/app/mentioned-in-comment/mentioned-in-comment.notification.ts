import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DicebearComponent } from '@elementar-ui/components/avatar';
import { Notification } from '@elementar-ui/components/notifications';

@Component({
  selector: 'app-mentioned-in-comment',
  imports: [MatIcon, DicebearComponent],
  templateUrl: './mentioned-in-comment.notification.html',
  styleUrl: './mentioned-in-comment.notification.scss',
})
export class MentionedInCommentNotificationComponent {
  notification = input.required<Notification>();
}
