import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTypeDialog } from './event-type-dialog';

describe('EventTypeDialog', () => {
  let component: EventTypeDialog;
  let fixture: ComponentFixture<EventTypeDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTypeDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventTypeDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
