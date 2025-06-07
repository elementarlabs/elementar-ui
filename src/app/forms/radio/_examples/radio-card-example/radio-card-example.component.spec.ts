import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioCardExampleComponent } from './radio-card-example.component';

describe('RadioCardExampleComponent', () => {
  let component: RadioCardExampleComponent;
  let fixture: ComponentFixture<RadioCardExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioCardExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioCardExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
