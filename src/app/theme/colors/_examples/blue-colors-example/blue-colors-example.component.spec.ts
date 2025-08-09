import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueColorsExampleComponent } from './blue-colors-example.component';

describe('BlueColorsExampleComponent', () => {
  let component: BlueColorsExampleComponent;
  let fixture: ComponentFixture<BlueColorsExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlueColorsExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlueColorsExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
