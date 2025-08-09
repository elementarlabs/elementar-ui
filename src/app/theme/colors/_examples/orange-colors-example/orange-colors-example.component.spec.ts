import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrangeColorsExampleComponent } from './orange-colors-example.component';

describe('OrangeColorsExampleComponent', () => {
  let component: OrangeColorsExampleComponent;
  let fixture: ComponentFixture<OrangeColorsExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrangeColorsExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrangeColorsExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
