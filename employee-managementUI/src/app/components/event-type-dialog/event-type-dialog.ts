import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-event-type-dialog',
  imports: [],
  templateUrl: './event-type-dialog.html',
  styleUrl: './event-type-dialog.css'
})
export class EventTypeDialog {


  constructor(private dialogRef: MatDialogRef<EventTypeDialog>) {}

  select(type: string)
  {
    this.dialogRef.close(type);
  }

  
}
