import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Crop } from './crop';

describe('Crop', () => {
  let component: Crop;
  let fixture: ComponentFixture<Crop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Crop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Crop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
