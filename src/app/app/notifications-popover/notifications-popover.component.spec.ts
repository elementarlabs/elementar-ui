import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsPopoverComponent } from './notifications-popover.component';

describe('NotificationsPopoverComponent', () => {
  let component: NotificationsPopoverComponent;
  let fixture: ComponentFixture<NotificationsPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsPopoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
