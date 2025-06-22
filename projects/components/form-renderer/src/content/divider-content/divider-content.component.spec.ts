import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividerContentComponent } from './divider-content.component';

describe('DividerContentComponent', () => {
  let component: DividerContentComponent;
  let fixture: ComponentFixture<DividerContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividerContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DividerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
