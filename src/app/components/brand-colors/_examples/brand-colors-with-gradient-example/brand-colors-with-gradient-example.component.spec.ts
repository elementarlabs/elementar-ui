import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandColorsWithGradientExampleComponent } from './brand-colors-with-gradient-example.component';

describe('BrandColorsWithGradientExampleComponent', () => {
  let component: BrandColorsWithGradientExampleComponent;
  let fixture: ComponentFixture<BrandColorsWithGradientExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandColorsWithGradientExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandColorsWithGradientExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
