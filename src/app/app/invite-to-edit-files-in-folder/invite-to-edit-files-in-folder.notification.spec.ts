import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteToEditFilesInFolderNotification } from './invite-to-edit-files-in-folder.notification';

describe('InviteToEditFilesInFolderNotification', () => {
  let component: InviteToEditFilesInFolderNotification;
  let fixture: ComponentFixture<InviteToEditFilesInFolderNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteToEditFilesInFolderNotification]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InviteToEditFilesInFolderNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
