import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioCardTitleComponent } from './radio-card-title.component';

describe('RadioCardTitleComponent', () => {
  let component: RadioCardTitleComponent;
  let fixture: ComponentFixture<RadioCardTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioCardTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioCardTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
