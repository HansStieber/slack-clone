import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmChatroomComponent } from './dm-chatroom.component';

describe('DmChatroomComponent', () => {
  let component: DmChatroomComponent;
  let fixture: ComponentFixture<DmChatroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmChatroomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmChatroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
