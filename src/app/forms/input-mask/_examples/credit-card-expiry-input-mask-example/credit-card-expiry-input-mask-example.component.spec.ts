import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardExpiryInputMaskExampleComponent } from './credit-card-expiry-input-mask-example.component';

describe('CreditCardExpiryInputMaskExampleComponent', () => {
  let component: CreditCardExpiryInputMaskExampleComponent;
  let fixture: ComponentFixture<CreditCardExpiryInputMaskExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardExpiryInputMaskExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardExpiryInputMaskExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
