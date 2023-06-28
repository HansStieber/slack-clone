import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNoticeDialogComponentComponent } from './delete-notice-dialog-component.component';

describe('DeleteNoticeDialogComponentComponent', () => {
  let component: DeleteNoticeDialogComponentComponent;
  let fixture: ComponentFixture<DeleteNoticeDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteNoticeDialogComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteNoticeDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
