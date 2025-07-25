import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../models/userModel';
import { AuthService } from '../../services/auth-service';
import { EmpService } from '../../services/emp-service';
import { Employee } from '../../models/employeeModel';

@Component({
  selector: 'app-update-role',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './update-role.html',
  styleUrl: './update-role.css'
})
export class UpdateRole implements OnInit {
  form!: FormGroup;
  message = '';
  emp!: Employee;
  empId!: number;
  

  constructor(private fb: FormBuilder, private auth: AuthService, private route: ActivatedRoute, private router: Router, private empService: EmpService) {
    
  }
  ngOnInit(): void {
  // Step 1: Set up the form so Angular doesn’t throw
  this.form = this.fb.group({
    currentRole: [{ value: '', disabled: true }],
    newRole: ['', Validators.required]
  });

  // Step 2: Get user and update form
  this.empId = Number(this.route.snapshot.paramMap.get('id'));
  this.empService.getEmp(this.empId).subscribe((res: any) => {
    this.emp = res;
    this.form.patchValue({ currentRole: this.emp.role });
  });
}


  submit() {
    if (this.form.invalid) return;
    
    const payload = {
      id: this.empId,
      currentRole: this.form.get('currentRole')?.value,
      newRole: this.form.get('newRole')?.value
    };

    console.log(payload);
    this.auth.updateRole(payload).subscribe({
      next: () => {
        this.message = 'User Role Updated Successfully!';
        this.router.navigate(['/admin']);
        
      },
      error: err => console.error('Update error:', err)
    });
  }

  get isAdmin(): boolean {
    return localStorage.getItem('role') == 'Admin';
  }
}
