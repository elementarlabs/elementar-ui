import { Component, signal } from '@angular/core';
import { InlineTextEditComponent } from '@elementar-ui/components/inline-text-edit';
import { AlertComponent } from '@elementar-ui/components/alert';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-basic-inline-text-edit-example',
  imports: [
    InlineTextEditComponent,
    AlertComponent,
    MatDivider
  ],
  templateUrl: './basic-inline-text-edit-example.component.html',
  styleUrl: './basic-inline-text-edit-example.component.scss'
})
export class BasicInlineTextEditExampleComponent {
  projectName = signal('My Awesome Project');
  projectDescription = signal(
    'This is a description inside a tag. You can edit me too!'
  );

  onSaveName(value: string) {
    this.projectName.set(value);
  }

  onSaveDescription(value: string) {
    this.projectDescription.set(value);
  }
}
