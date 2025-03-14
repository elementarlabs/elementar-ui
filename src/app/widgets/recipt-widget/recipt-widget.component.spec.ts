import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciptWidgetComponent } from './recipt-widget.component';

describe('ReciptWidgetComponent', () => {
  let component: ReciptWidgetComponent;
  let fixture: ComponentFixture<ReciptWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReciptWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReciptWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
