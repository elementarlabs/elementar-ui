import { Component, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ComponentConfig } from '../../models/form-config.model';

@Component({
  selector: 'emr-text-content',
  imports: [],
  templateUrl: './text-content.component.html',
  styleUrl: './text-content.component.scss'
})
export class TextContentComponent {
  config = input.required<ComponentConfig>();
  sanitizedHtml: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(
      this.config().content?.['htmlContent'] || ''
    );
  }
}
