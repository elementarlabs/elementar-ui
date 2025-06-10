import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezoneFieldComponent } from './timezone-field.component';

describe('TimezoneFieldComponent', () => {
  let component: TimezoneFieldComponent;
  let fixture: ComponentFixture<TimezoneFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimezoneFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimezoneFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
