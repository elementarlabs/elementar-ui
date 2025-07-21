import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyWithCountryNameExampleComponent } from './currency-with-country-name-example.component';

describe('CurrencyWithCountryNameExampleComponent', () => {
  let component: CurrencyWithCountryNameExampleComponent;
  let fixture: ComponentFixture<CurrencyWithCountryNameExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyWithCountryNameExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyWithCountryNameExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
