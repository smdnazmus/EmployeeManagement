import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/userModel';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-users',
  imports: [CommonModule, RouterModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit{
  users: User[] = [];

  constructor(private userService: UserService, private route: ActivatedRoute, private auth: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((res: User[]) => {
      console.log(res);
      this.users = res;
    });
  }

  updateUser(user: User) {
    
    const updatedUsername = prompt("Edit username", user.username);
    if (updatedUsername !== null) {
      const updated = {...user, username: updatedUsername};
      this.userService.updateUser(user.id, updated)
      .subscribe(() => {
        user.username = updatedUsername;
      });
    }
   
  }

  deleteUser(id: number) {
    if (confirm("Are you sure?")) {
      this.userService.deleteUser(id)
        .subscribe(() => {
          this.users = this.users.filter(u => u.id !== id);
        });
    }
  }

  logout() {
    localStorage.removeItem('token');
    location.reload();
  }

  isCurrentUser(user: User) : boolean {
    const currentUsername = localStorage.getItem('username');
    return currentUsername === user.username;
  }

  get isAdmin(): boolean {
    return localStorage.getItem('role') == 'Admin';
  }

  get isLoggedIn() : boolean {
    console.log(this.auth.isAuthenticatd);
    return this.auth.isAuthenticatd;
  }
}
