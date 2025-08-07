import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicDateFormatSelectExampleComponent } from './basic-date-format-select-example.component';

describe('BasicDateFormatSelectExampleComponent', () => {
  let component: BasicDateFormatSelectExampleComponent;
  let fixture: ComponentFixture<BasicDateFormatSelectExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicDateFormatSelectExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicDateFormatSelectExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
