import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionedInCommentNotification } from './mentioned-in-comment.notification';

describe('MentionedInCommentNotification', () => {
  let component: MentionedInCommentNotification;
  let fixture: ComponentFixture<MentionedInCommentNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentionedInCommentNotification]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MentionedInCommentNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
