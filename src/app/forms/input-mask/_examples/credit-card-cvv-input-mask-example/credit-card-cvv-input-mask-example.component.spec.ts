import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardCvvInputMaskExampleComponent } from './credit-card-cvv-input-mask-example.component';

describe('CreditCardCvvInputMaskExampleComponent', () => {
  let component: CreditCardCvvInputMaskExampleComponent;
  let fixture: ComponentFixture<CreditCardCvvInputMaskExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardCvvInputMaskExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardCvvInputMaskExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
