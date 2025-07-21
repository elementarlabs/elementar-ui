import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencySelectComponent } from './currency-select.component';

describe('CurrencySelectComponent', () => {
  let component: CurrencySelectComponent;
  let fixture: ComponentFixture<CurrencySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencySelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
