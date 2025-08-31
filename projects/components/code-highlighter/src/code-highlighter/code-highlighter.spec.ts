import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeHighlighter } from './code-highlighter';

describe('CodeHighlighter', () => {
  let component: CodeHighlighter;
  let fixture: ComponentFixture<CodeHighlighter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeHighlighter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeHighlighter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
