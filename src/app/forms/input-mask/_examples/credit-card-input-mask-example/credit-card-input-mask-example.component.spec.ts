import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardInputMaskExampleComponent } from './credit-card-input-mask-example.component';

describe('CreditCardInputMaskExampleComponent', () => {
  let component: CreditCardInputMaskExampleComponent;
  let fixture: ComponentFixture<CreditCardInputMaskExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardInputMaskExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardInputMaskExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
