import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenColorsExampleComponent } from './green-colors-example.component';

describe('GreenColorsExampleComponent', () => {
  let component: GreenColorsExampleComponent;
  let fixture: ComponentFixture<GreenColorsExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreenColorsExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GreenColorsExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
