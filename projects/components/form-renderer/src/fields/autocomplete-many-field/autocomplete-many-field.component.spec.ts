import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteManyFieldComponent } from './autocomplete-many-field.component';

describe('AutocompleteManyFieldComponent', () => {
  let component: AutocompleteManyFieldComponent;
  let fixture: ComponentFixture<AutocompleteManyFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteManyFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutocompleteManyFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
