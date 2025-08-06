import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LeaveService } from '../../services/leave-service';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Employee } from '../../models/employeeModel';
import { EmpService } from '../../services/emp-service';
import { FilterPipe } from '../../pipe/filter-pipe-pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Title } from '@angular/platform-browser';
import { Todoservice } from '../../services/todoservice';
import { EventTypeDialog } from '../event-type-dialog/event-type-dialog';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-todoform',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, CommonModule, MatDatepickerModule, MatAutocompleteModule, MatIconModule],
  templateUrl: './todoform.html',
  styleUrl: './todoform.css'
})
export class Todoform implements OnInit{


  todoForm!: FormGroup;
  username: string = '';


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<Todoform>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedDate: Date },
    private datePipe: DatePipe,
    private todoService: Todoservice,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? '';

    const now = new Date();

    const selectedDate = new Date(
      this.data.selectedDate.getFullYear(),
      this.data.selectedDate.getMonth(),
      this.data.selectedDate.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    this.todoForm = this.fb.group({
      title: ['', [Validators.required]],
      dueDate: [selectedDate, [Validators.required]],
      createdBy: [{value: ''}]
    });
  }



  addTask() {
    if (this.todoForm.valid) {
      const formattedDate = new Date(this.todoForm.value.dueDate);
      formattedDate.setHours(9, 0, 0);
      const todoData = {
        title: this.todoForm.value.title,
        //dueDate: this.todoForm.value.dueDate,
        dueDate: formattedDate,
        createdBy: this.username
        //status: this.leaveReq.status
      };

      console.log(todoData);

      this.todoService.createTask(todoData).subscribe({
        next: res => {
          this.toastr.success('Task Submitted.');
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
