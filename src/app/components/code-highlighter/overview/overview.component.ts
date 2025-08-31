import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { PageTitleDirective } from '@meta/page/page-title.directive';
import { CodeHighlighter } from '@elementar-ui/components/code-highlighter';

@Component({
  selector: 'app-code-highlighter-overview',
  imports: [
    PageComponent,
    PageContentDirective,
    PageTitleDirective,
    CodeHighlighter
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent {
  readonly sampleTs = `import { Component } from '@angular/core';\n\n@Component({\n  selector: 'hello-world',\n  template: '<h1>Hello, world!</h1>'\n})\nexport class HelloWorld {}`;
}
