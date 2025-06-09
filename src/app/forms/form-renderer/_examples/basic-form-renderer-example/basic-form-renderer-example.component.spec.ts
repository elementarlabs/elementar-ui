import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicFormRendererExampleComponent } from './basic-form-renderer-example.component';

describe('BasicFormRendererExampleComponent', () => {
  let component: BasicFormRendererExampleComponent;
  let fixture: ComponentFixture<BasicFormRendererExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicFormRendererExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicFormRendererExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
