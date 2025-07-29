import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { countries } from '../../data/country-data-store';
import { EmpService } from '../../services/emp-service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Employee } from '../../models/employeeModel';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-create-employee',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-employee.html',
  styleUrl: './create-employee.css'
})
export class CreateEmployee {
  apiBaseUrl = environment.apiBaseUrl;
  employee: any = {};
  empCreateForm!: FormGroup;
  isEditMode = false;
  databaseId!: number;
  empId!: number;
  changePassword = false;
  public countries:any = countries;
  selectedPhotoFile!: File;
  photoPreviewUrl: string | null = null;

  nidDrawerOpen = false;
  selectedNidFile!: File;

  drawerOpen = false;
  

  constructor(private empService: EmpService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private toastr: ToastrService) {}

  ngOnInit(): void {
    if (!this.isEditMode) {
      this.generateAndVerifyEmpId();
    }
    this.empCreateForm = this.fb.group({
      employeeId:[{value: 0, disabled: true}, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      nid: ['', Validators.required],
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
      role: ['', Validators.required],
      department: ['', Validators.required],
      position: ['', Validators.required],
      hireDate: ['', Validators.required],
      salary: [0, Validators.required],
      photoUrl: [''],
      nidUrl: ['']
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.databaseId = +idParam;
      this.loadEmpData(this.databaseId);
    }

  }

  loadEmpData(id: number) {
    this.empService.getEmp(id).subscribe((emp: any) => {
      //this.empId = emp.employeeId;
      const formattedEmp = {
      ...emp,
      birthDate: typeof emp.birthDate === 'string'
        ? emp.birthDate.slice(0, 10)
        : '', hireDate: typeof emp.hireDate == 'string'
        ? emp.hireDate.slice(0, 10)
        : ''
    };
      this.empCreateForm.patchValue(formattedEmp);
      this.empCreateForm.get('passwordHash')?.setValue(''); // optionally clear the password field
      this.empCreateForm.controls['employeeId'].setValue(emp.employeeId);
      this.photoPreviewUrl = this.apiBaseUrl + emp.photoUrl;
    });
  }

  submitForm() {
    if (this.isEditMode) {
      this.empCreateForm.get('password')?.disable();
    }

    if (this.empCreateForm.invalid) {
      
      Object.keys(this.empCreateForm.controls).forEach(key => {
        const control = this.empCreateForm.get(key);
        if (control && control.invalid) {
          console.warn(`${key} is invalid`, control.errors);
        }
      });

      this.toastr.warning('Some fields are invalid. Please review the form. All the input fields should be filled with valid data.');
      
      return;
    }
    
    let formData = this.empCreateForm.getRawValue(); // includes disabled fields
    console.log(formData);

    if (this.isEditMode) {
      delete formData.password;
      delete formData.role;
      formData.id = this.databaseId;
      //formData.employeeId = this.empId;
      this.empId = formData.employeeId;
      this.empService.updateEmp(this.databaseId, formData).subscribe(
        { next: (res: any) => {
          //this.empId = res.id;

          if (this.selectedPhotoFile) {
            this.uploadPhoto(this.selectedPhotoFile, this.databaseId);
          }
          if (this.selectedNidFile) {
            this.uploadNID(this.databaseId, this.selectedNidFile);
          }
          this.toastr.success("Updated Successfully!");
          this.router.navigate(['/employees'])
        },
          error: err => {
            this.toastr.error("Unable to Update. Contact the service provider!");
          }
        });
      //console.log('Updated!', formData);
    }else {
      this.empService.createEmp(formData).subscribe({
        next: (res: Employee) => {
          const createdDatabaseId = res.id;

          this.databaseId = createdDatabaseId;

          // Now trigger photo upload
          this.uploadPhoto(this.selectedPhotoFile, createdDatabaseId);
          this.uploadNID(createdDatabaseId, this.selectedNidFile);
          this.router.navigate(['/employees']);
        },
        error: err => {
          
      console.error('Create error:', err);
      console.error('Validation Errors:', err.error.errors);
    
        }
      });
    }
/*
    if (this.registrationForm.valid) {
      const newUser = this.registrationForm.value;
      this.userService.register(newUser)
      .subscribe(() => {
        this.router.navigate(['/users']);
      });
      console.log('Registered:', newUser);
    }
   */ 
  }

  get isAdmin(): boolean {
    return localStorage.getItem('role') == 'Admin';
  }

onFileSelected(event: Event): void {
  //const file = event.target.files[0];
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreviewUrl = reader.result as string;
      this.selectedPhotoFile = file;
      this.closeDrawer();
    };

    reader.readAsDataURL(file);
  }

  //this.selectedPhotoFile = file;

  // Show immediate preview from local file
  //this.photoPreviewUrl = URL.createObjectURL(file);
/*
  if (this.isEditMode && this.databaseId) {
    this.uploadPhoto(file, this.databaseId);
  }
    */
}

uploadPhoto(file: File, id: number): void {
  const formData = new FormData();
  formData.append('photo', file);

  this.empService.uploadPhoto(id, formData).subscribe({
    next: (res: any) => {
      this.empCreateForm.patchValue({ photoUrl: res.photoUrl });
      this.photoPreviewUrl = this.apiBaseUrl + res.photoUrl;
    },
    error: err => console.error('Upload failed:', err)
  });
}

uploadNID(id: number, file: File) : void {
  if (!this.selectedNidFile) {
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  this.empService.uploadNID(id, formData).subscribe({
    next: (res: any) => {
      this.empCreateForm.patchValue({ nidUrl: res.nidUrl});
      this.toastr.success(res.message);
    },
    error: err => {
      this.toastr.error(err.error);
    }
  });
}


  generateAndVerifyEmpId() {
    const newId = this.generateEmployeeId();

    this.empService.checkUniqueEmpId(newId).subscribe(isUnique => {
      if (isUnique) {
        this.empCreateForm.controls['employeeId'].setValue(newId);
      }
      else {
        // Try again or notify user
        this.generateAndVerifyEmpId(); 
      }
    });
  }

  generateEmployeeId() : number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  openDrawer() {
  this.drawerOpen = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  openNidDrawer() {
    this.nidDrawerOpen = true;
  }

  closeNidDrawer() {
    this.nidDrawerOpen = false;
    //this.selectedNidFile = null;
  }

  onNidSelected(event: any) {
    this.selectedNidFile = event.target.files[0];
  }

  

}
