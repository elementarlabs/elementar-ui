import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioCardGroupComponent } from './radio-card-group.component';

describe('RadioCardGroupComponent', () => {
  let component: RadioCardGroupComponent;
  let fixture: ComponentFixture<RadioCardGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioCardGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioCardGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
