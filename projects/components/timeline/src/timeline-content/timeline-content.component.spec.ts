import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineContentComponent } from './timeline-content.component';

describe('TimelineContentComponent', () => {
  let component: TimelineContentComponent;
  let fixture: ComponentFixture<TimelineContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
