import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicCurrencySelectExampleComponent } from './basic-currency-select-example.component';

describe('BasicCurrencySelectExampleComponent', () => {
  let component: BasicCurrencySelectExampleComponent;
  let fixture: ComponentFixture<BasicCurrencySelectExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicCurrencySelectExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicCurrencySelectExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
