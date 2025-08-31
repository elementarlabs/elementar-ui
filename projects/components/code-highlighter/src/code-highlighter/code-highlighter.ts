import { Component, ChangeDetectionStrategy, input, OnChanges, SimpleChanges, signal, computed, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { codeToHtml } from 'shiki';

@Component({
  selector: 'emr-code-highlighter',
  exportAs: 'emrCodeHighlighter',
  templateUrl: './code-highlighter.html',
  styleUrl: './code-highlighter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'emr-code-highlighter',
    '[class.is-inline]': 'inline()',
  }
})
export class CodeHighlighter implements OnChanges {
  private sanitizer = inject(DomSanitizer);

  code = input.required<string>();
  language = input<string>('bash');
  theme = input<string>('dracula-soft');
  inline = input<boolean>(false);

  readonly content = signal<SafeHtml | null>(null);
  readonly isLoading = signal<boolean>(false);

  async ngOnChanges(changes: SimpleChanges) {
    if (!this.code()) {
      this.content.set(null);
      return;
    }
    this.isLoading.set(true);
    try {
      const highlighted = await codeToHtml(
        this.code(),
        {
          lang: this.language(),
          theme: this.theme(),
        }
      );
      this.content.set(this.sanitizer.bypassSecurityTrustHtml(highlighted));
    } catch (e) {
      // Fallback: raw code escaped inside pre
      const escaped = this.code()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const fallback = this.inline() ? `<code>${escaped}</code>` : `<pre class="shiki"><code>${escaped}</code></pre>`;
      this.content.set(this.sanitizer.bypassSecurityTrustHtml(fallback));
      console.error('CodeHighlighter error:', e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
