import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CalendarService } from '../../services/calendar-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { EventTypeDialog } from '../event-type-dialog/event-type-dialog';

@Component({
  selector: 'app-calendar-event-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, CommonModule, MatDatepickerModule, MatAutocompleteModule, MatIconModule],
  templateUrl: './calendar-event-form.html',
  styleUrl: './calendar-event-form.css'
})
export class CalendarEventForm implements OnInit{
  eventsForm!: FormGroup;

  selectedDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CalendarEventForm>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedDate: Date },
    private datePipe: DatePipe,
    private calendarService: CalendarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const now = new Date();

     this.selectedDate = new Date(
      this.data.selectedDate.getFullYear(),
      this.data.selectedDate.getMonth(),
      this.data.selectedDate.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    this.eventsForm = this.fb.group({
      localName: ['', [Validators.required]],
      date: [this.selectedDate, [Validators.required]]
    });
  }

addEvent() {
  if (this.eventsForm.valid) {
      const formattedDate = new Date(this.eventsForm.value.date);
      formattedDate.setHours(9, 0, 0);

      const eventData = {
        localName: this.eventsForm.value.localName,
        date: formattedDate.toISOString()
      };

      console.log(eventData);

      this.calendarService.createCalendarEvent(eventData).subscribe({
        next: res => {
          this.toastr.success('Event Submitted.');
          this.dialogRef.close('submitted');
          this.ngOnInit();
        },
        error: err => {
          this.toastr.error('Sumission failed. Contact service provider.')
        }
      });
    } 
}

goBack() {
    this.dialogRef.close();
    this.dialog.open(EventTypeDialog, {
      width: '400px',
      autoFocus: false
    });
  }

}
