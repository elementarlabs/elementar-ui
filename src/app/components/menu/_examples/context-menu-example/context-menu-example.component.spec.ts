import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuExampleComponent } from './context-menu-example.component';

describe('ContextMenuExampleComponent', () => {
  let component: ContextMenuExampleComponent;
  let fixture: ComponentFixture<ContextMenuExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextMenuExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContextMenuExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
