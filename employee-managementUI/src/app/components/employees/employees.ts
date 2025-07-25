import { Component } from '@angular/core';
import { Employee } from '../../models/employeeModel';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EmpService } from '../../services/emp-service';
import { CommonModule } from '@angular/common';
import { User } from '../../models/userModel';

@Component({
  selector: 'app-employees',
  imports: [CommonModule, RouterModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees {
  emps: Employee[] = [];
  currentUsername: string | null = null;
  isDrawerOpen:boolean = false;
  selectedFile: File | null = null;
  uploadMessage: string = "";
;

  constructor(private empService: EmpService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadEmps();
  }

  loadEmps() {
    this.currentUsername = localStorage.getItem('username');
    console.log(this.currentUsername);
    this.empService.getEmps().subscribe((res: Employee[]) => {
      console.log(res);
      this.emps = res;
      /*
      this.emps = res.map(emp => ({
        ...emp,
        isCurrent: emp.username === currentUsername
      }));
      */
    });
  }

  updateEmp(emp: Employee) {
    
    const updatedUsername = prompt("Edit username", emp.username);
    if (updatedUsername !== null) {
      const updated = {...emp, username: updatedUsername};
      this.empService.updateEmp(emp.id, updated)
      .subscribe(() => {
        emp.username = updatedUsername;
      });
    }
   
  }

  deleteEmp(id: number) {
    if (confirm("Are you sure?")) {
      this.empService.deleteEmp(id)
        .subscribe(() => {
          this.emps = this.emps.filter(u => u.id !== id);
        });
    }
  }

  logout() {
    localStorage.removeItem('token');
    location.reload();
  }

  get isAdmin(): boolean {
    return localStorage.getItem('role') == 'Admin';
  }

/*
  isCurrentUser(emp: Employee) : boolean {
      const currentUsername = localStorage.getItem('username');
      console.log(emp.username);
      console.log(currentUsername);
      return currentUsername === emp.username;
    }
      */

    toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  onCSVUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

   uploadCSV() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile!);

    this.empService.uploadCSV(formData).subscribe({
      next: (res: any) => {
        this.uploadMessage = `Uploaded ${res.count} employees successfully added!`;
        
        //this.router.navigate(['/employees'])

      },
      error: err => {
        this.uploadMessage = 'Upload Failed!';
        console.log(err);
      }
      
    });
  }

  exportEmpCSV() {
  const headers = ['ID', 'FirstName', 'LastName', 'BirthDate', 'NID', 'Username','Email', 'PhoneNumber', 'Address', 'City', 'District', 'Division', 'Country', 'Role', 'Department', 'Position', 'HireDate', 'Salary'];
  const rows = this.emps
    .map(u => 
      `${u.id}, ${u.firstName}, ${u.lastName}, ${u.birthDate}, ${u.nid}, ${u.username}, ${u.email}, ${u.phoneNumber}, ${u.address}, ${u.city}, ${u.district}, ${u.division}, ${u.country}, ${u.role}, ${u.department}, ${u.position}, ${u.hireDate}, ${u.salary}`);

  const csvContent = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'all_employees.csv';
  a.click();
  URL.revokeObjectURL(url);
}
}
