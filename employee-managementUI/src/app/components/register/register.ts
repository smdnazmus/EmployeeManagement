import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user-service';
import { CountrySelectComponent } from '@wlucha/ng-country-select'
import { countries } from '../../data/country-data-store';


@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit{
  /*
   user: User = {
     id: 0,
     username: '',
     passwordHash: '',
     email: '',
     firstName: '',
     lastName: '',
     birthDate: new Date(),
     phoneNumber: '',
     address: '',
     city: '',
     district: '',
     division: '',
     country: '',
     role: 'User'
   };
*/
   registrationForm!: FormGroup;
   isEditMode = false;
   userId!: number;
   changePassword = false;
   public countries:any = countries;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      division: ['', Validators.required],
      country: ['', Validators.required],
      //role: [{value: 'User', disabled: true}, Validators.required]
      role: ['', Validators.required]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.userId = +idParam;
      this.loadUserData(this.userId);
    }
  }

  loadUserData(id: number) {
    this.userService.getUser(id).subscribe((user: any) => {
      const formattedUser = {
      ...user,
      birthDate: typeof user.birthDate === 'string'
        ? user.birthDate.slice(0, 10)
        : ''
    };
      this.registrationForm.patchValue(formattedUser);
      this.registrationForm.get('passwordHash')?.setValue(''); // optionally clear the password field
    });
  }

  submitForm() {
    if (this.isEditMode) {
      this.registrationForm.get('password')?.disable();
    }

    if (this.registrationForm.invalid) {
      /*
      Object.keys(this.registrationForm.controls).forEach(key => {
    const control = this.registrationForm.get(key);
    if (control && control.invalid) {
      console.warn(`${key} is invalid`, control.errors);
    }
  });
  */
      return;
    }
    
    let formData = this.registrationForm.getRawValue(); // includes disabled fields

    if (this.isEditMode) {
      // Remove fields you don't want to update
      delete formData.password;
      delete formData.role;

      formData.id = this.userId;
    }

    if (this.isEditMode) {
      this.userService.updateUser(this.userId, formData).subscribe(
        { next: () => this.router.navigate(['/users']),
          error: err => console.error('Update error:', err)
        });
      console.log('Updated!', formData);
    }else {
      this.userService.register(formData).subscribe(() => this.router.navigate(['/users']));
      console.log('Registered!', formData);
    }
  }

  get isAdmin(): boolean {
    return localStorage.getItem('role') == 'Admin';
  }
}
