import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineTextEditComponent } from './inline-text-edit.component';

describe('InlineTextEditComponent', () => {
  let component: InlineTextEditComponent;
  let fixture: ComponentFixture<InlineTextEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineTextEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InlineTextEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
