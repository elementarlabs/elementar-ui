import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedColorsExampleComponent } from './red-colors-example.component';

describe('RedColorsExampleComponent', () => {
  let component: RedColorsExampleComponent;
  let fixture: ComponentFixture<RedColorsExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedColorsExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedColorsExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
