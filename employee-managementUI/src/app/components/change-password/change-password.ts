import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '../../models/userModel';
import { AuthService } from '../../services/auth-service';
import { EmpService } from '../../services/emp-service';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword implements OnInit{
  form!: FormGroup;
  message = '';
  emp!: User;
  empId!: number;

  constructor(private fb: FormBuilder, 
    private auth: AuthService, 
    private route: ActivatedRoute, 
    private router: Router,
    private empService: EmpService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.empId = Number(this.route.snapshot.paramMap.get('id'));

    this.empService.getEmp(this.empId).subscribe((res: any) => {
      this.emp = res;
      //this.form.patchValue
    });
  }

  submit() {
    if (this.form.invalid) return;
    const payload = {
      //id: this.userId,
      currentPassword: this.form.get('currentPassword')?.value,
      newPassword: this.form.get('newPassword')?.value
    };

    console.log(payload);

    console.log('Token:', localStorage.getItem('token'));

    this.auth.changeEmpPassword(payload).subscribe({
      next: res => {
        this.message = 'Password updated successfully!';
        this.auth.logout();
        //this.router.navigate(['/employees']);
      },
      error: err => this.message = err.error 
    });

  }
}
