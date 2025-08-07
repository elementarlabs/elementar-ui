import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateFormatSelectComponent } from './date-format-select.component';

describe('DateFormatSelectComponent', () => {
  let component: DateFormatSelectComponent;
  let fixture: ComponentFixture<DateFormatSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateFormatSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateFormatSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
