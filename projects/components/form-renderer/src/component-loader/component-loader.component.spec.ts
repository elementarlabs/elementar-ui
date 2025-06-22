import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentLoaderComponent } from './component-loader.component';

describe('ComponentLoaderComponent', () => {
  let component: ComponentLoaderComponent;
  let fixture: ComponentFixture<ComponentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
