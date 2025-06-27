import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAsideComponent } from './panel-aside.component';

describe('PanelAsideComponent', () => {
  let component: PanelAsideComponent;
  let fixture: ComponentFixture<PanelAsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelAsideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
