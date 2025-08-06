import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveReqForm } from './leave-req-form';

describe('LeaveReqForm', () => {
  let component: LeaveReqForm;
  let fixture: ComponentFixture<LeaveReqForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveReqForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveReqForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
