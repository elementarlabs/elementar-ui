import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DicebearComponent } from '@elementar-ui/components/avatar';
import { Notification } from '@elementar-ui/components/notifications';

@Component({
  selector: 'emr-invite-to-edit-files-in-folder',
  imports: [
    MatIcon,
    DicebearComponent
  ],
  templateUrl: './invite-to-edit-files-in-folder.notification.html',
  styleUrl: './invite-to-edit-files-in-folder.notification.scss'
})
export class InviteToEditFilesInFolderNotification {
  notification = input.required<Notification>();
}
