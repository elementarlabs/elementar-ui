import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioCardContentComponent } from './radio-card-content.component';

describe('RadioCardContentComponent', () => {
  let component: RadioCardContentComponent;
  let fixture: ComponentFixture<RadioCardContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioCardContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioCardContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
