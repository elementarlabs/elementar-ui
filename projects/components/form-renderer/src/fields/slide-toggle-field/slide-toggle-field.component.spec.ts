import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideToggleFieldComponent } from './slide-toggle-field.component';

describe('SlideToggleFieldComponent', () => {
  let component: SlideToggleFieldComponent;
  let fixture: ComponentFixture<SlideToggleFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideToggleFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideToggleFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
