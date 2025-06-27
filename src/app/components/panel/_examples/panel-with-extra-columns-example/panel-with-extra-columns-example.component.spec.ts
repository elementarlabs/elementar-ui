import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelWithExtraColumnsExampleComponent } from './panel-with-extra-columns-example.component';

describe('PanelWithExtraColumnsExampleComponent', () => {
  let component: PanelWithExtraColumnsExampleComponent;
  let fixture: ComponentFixture<PanelWithExtraColumnsExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelWithExtraColumnsExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelWithExtraColumnsExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
