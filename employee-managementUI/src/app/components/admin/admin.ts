import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

//import { NgChartsModule } from 'ng2-charts';
import { FilterPipe } from '../../pipe/filter-pipe-pipe';
import { UserService } from '../../services/user-service';
import { User } from '../../models/userModel';
import { Router, RouterModule } from '@angular/router';
import { EmpService } from '../../services/emp-service';
import { Employee } from '../../models/employeeModel';

declare var bootstrap: any;


@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, FilterPipe, RouterModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})

export class Admin implements OnInit{
  //users: User[] = [];
  emps: Employee[] = [];
  searchTerm = '';
  selectedFile: File | null = null;
  uploadMessage = '';

  isDrawerOpen : boolean = false;

  
/*
  newUser: User = {
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
  constructor(private userService: UserService, private empService: EmpService, private router: Router) {}

  ngOnInit(): void {
    //this.loadUsers();
    this.loadEmps();
    //this.updateChartData();
  }

  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
/*
  createUser() {
    this.userService.register(this.newUser).subscribe(() => {
      this.loadUsers(); // Refresh list
      this.newUser = {
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
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }
*/
  loadEmps() {
    this.empService.getEmps().subscribe(data => {
      this.emps = data;
    });
  }
/*
  updateRole(user: User) {
    const newRole = prompt('Update Role (User/Admin)', user.role);
    if (newRole === 'User' || newRole === 'Admin') {
      const updated = { ...user, role: newRole };
      this.userService.updateUser(user.id, updated)
      .subscribe(() => user.role = newRole);
    }
  }

  deleteUser(id: number) {
    if (confirm("Delete this user?")) {
      this.userService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter(u => u.id !== id);
      });
    }
  }
*/
  deleteEmp(id: number) {
    if (confirm("Delete this user?")) {
      this.empService.deleteEmp(id).subscribe(() => {
        this.emps = this.emps.filter(u => u.id !== id);
      });
    }
  }
/*
  get totalUsers(): number {
  return this.users.length;
  }
*/
  get totalEmployees(): number {
    return this.emps.length;
  }
/*
  get totalAdmins(): number {
    return this.users.filter(u => u.role === 'Admin').length;
  }

  exportCSV() {
  const headers = ['ID', 'FirstName', 'LastName', 'BirthDate', 'Username','Email', 'PhoneNumber', 'Address', 'City', 'District', 'Division', 'Country', 'Role'];
  const rows = this.users
    .map(u => 
      `${u.id},
       ${u.firstName},
       ${u.lastName},
       ${u.birthDate},
       ${u.username},
       ${u.email},
       ${u.phoneNumber},
       ${u.address}, 
       ${u.city},
       ${u.district},
       ${u.division},
       ${u.country},
       ${u.role}`);

  const csvContent = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'users_report.csv';
  a.click();
  URL.revokeObjectURL(url);
}
*/
exportEmpCSV() {
  const headers = ['ID', 'FirstName', 'LastName', 'BirthDate', 'Username','Email', 'PhoneNumber', 'Address', 'City', 'District', 'Division', 'Country', 'Role', 'Department', 'Position', 'HireDate', 'Salary'];
  const rows = this.emps
    .map(u => 
      `${u.id}, ${u.firstName}, ${u.lastName}, ${u.birthDate}, ${u.username}, ${u.email}, ${u.phoneNumber}, ${u.address}, ${u.city}, ${u.district}, ${u.division}, ${u.country}, ${u.role}, ${u.department}, ${u.position}, ${u.hireDate}, ${u.salary}`);

  const csvContent = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'all_employees.csv';
  a.click();
  URL.revokeObjectURL(url);
}
/*
roleChartLabels = ['Users', 'Admins'];
roleChartData = [0, 0];
chartOptions = {
  responsive: true,
  plugins: { legend: { position: 'bottom' } }
};

updateChartData() {
  const users = this.users.filter(u => u.role === 'User').length;
  const admins = this.users.filter(u => u.role === 'Admin').length;
  this.roleChartData = [users, admins];
}
*/

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



}
