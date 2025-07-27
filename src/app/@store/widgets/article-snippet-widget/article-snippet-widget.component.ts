import { Component, inject, input, OnInit } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { DASHBOARD, Dashboard } from '@elementar-ui/components/dashboard';

export interface ArticleSnippetWidget {
  title: string;
  publishedAt: Date | string;
  imagePreviewUrl: string;
}

@Component({
  selector: 'emr-article-snippet-widget',
  imports: [
    MatRipple,
    DatePipe
  ],
  templateUrl: './article-snippet-widget.component.html',
  styleUrl: './article-snippet-widget.component.css'
})
export class ArticleSnippetWidgetComponent implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  id = input.required<any>();
  widget = input.required<ArticleSnippetWidget>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.id());
    }
  }
}
