import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Users } from './components/users/users';
import { AuthGuard } from './guard/auth-guard';
import { UserProfile } from './components/user-profile/user-profile';
import { Admin } from './components/admin/admin';
import { adminGuard } from './guard/admin-guard';
import { DirectPasswordReset } from './components/direct-password-reset/direct-password-reset';
import { ChangePassword } from './components/change-password/change-password';
import { UpdateRole } from './components/update-role/update-role';
import { CreateEmployee } from './components/create-employee/create-employee';
import { Employees } from './components/employees/employees';
import { EmployeeProfile } from './components/employee-profile/employee-profile';
import { Payroll } from './components/payroll/payroll';
import { Dashboard } from './components/dashboard/dashboard';
import { Finance } from './components/finance/finance';



export const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'login', component: Login, data: { hideLayout: true}},
    {path: 'reset-password-direct', component: DirectPasswordReset},
    {path: 'change-emp-password/:id', component: ChangePassword, canActivate: [AuthGuard]},
    {path: 'update-role/:id', component: UpdateRole},
    {path: 'register', component: Register},
    {path: 'register/:id', component: Register},
    {path: 'users', component: Users, canActivate: [AuthGuard]},
    {path: 'users/:id', component: UserProfile, canActivate: [AuthGuard]},
    {path: 'admin', component: Admin, canActivate: [adminGuard]},
    {path: 'create-employee', component: CreateEmployee, canActivate: [AuthGuard]},
    {path: 'create-employee/:id', component: CreateEmployee, canActivate: [AuthGuard]},
    {path: 'employees', component: Employees, canActivate: [AuthGuard]},
    {path: 'employees/:id', component: EmployeeProfile, canActivate: [AuthGuard]},
    {path: 'employees/upload-csv', component: CreateEmployee, canActivate: [AuthGuard]},
    {path: 'payroll', component: Payroll, canActivate: [AuthGuard]},
    {path: 'payroll/:id', component: Payroll, canActivate: [AuthGuard]},
    {path: 'dashboard', component: Dashboard, canActivate: [AuthGuard]},
    {path: 'finance', component: Finance, canActivate: [AuthGuard]}

];
