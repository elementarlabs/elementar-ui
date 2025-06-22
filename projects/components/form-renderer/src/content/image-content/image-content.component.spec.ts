import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageContentComponent } from './image-content.component';

describe('ImageContentComponent', () => {
  let component: ImageContentComponent;
  let fixture: ComponentFixture<ImageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
