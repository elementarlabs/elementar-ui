import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicImageCropExample } from './basic-image-crop-example';

describe('BasicImageCropExample', () => {
  let component: BasicImageCropExample;
  let fixture: ComponentFixture<BasicImageCropExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicImageCropExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicImageCropExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
