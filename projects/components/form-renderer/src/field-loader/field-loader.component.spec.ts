import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldLoaderComponent } from './field-loader.component';

describe('FieldLoaderComponent', () => {
  let component: FieldLoaderComponent;
  let fixture: ComponentFixture<FieldLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
