import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInlineTextEditExampleComponent } from './basic-inline-text-edit-example.component';

describe('BasicInlineTextEditExampleComponent', () => {
  let component: BasicInlineTextEditExampleComponent;
  let fixture: ComponentFixture<BasicInlineTextEditExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicInlineTextEditExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicInlineTextEditExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
