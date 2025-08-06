import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventForm } from './calendar-event-form';

describe('CalendarEventForm', () => {
  let component: CalendarEventForm;
  let fixture: ComponentFixture<CalendarEventForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarEventForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarEventForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
