import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleWidgetComponent } from './example-widget.component';

describe('ExampleWidgetComponent', () => {
  let component: ExampleWidgetComponent;
  let fixture: ComponentFixture<ExampleWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
