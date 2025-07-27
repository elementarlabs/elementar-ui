import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarMoreComponent } from './avatar-more.component';

describe('AvatarMoreComponent', () => {
  let component: AvatarMoreComponent;
  let fixture: ComponentFixture<AvatarMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarMoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
