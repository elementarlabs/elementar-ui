import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCompactModeFirstLetterExample } from './sidebar-compact-mode-first-letter-example';

describe('SidebarCompactModeFirstLetterExample', () => {
  let component: SidebarCompactModeFirstLetterExample;
  let fixture: ComponentFixture<SidebarCompactModeFirstLetterExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarCompactModeFirstLetterExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarCompactModeFirstLetterExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
