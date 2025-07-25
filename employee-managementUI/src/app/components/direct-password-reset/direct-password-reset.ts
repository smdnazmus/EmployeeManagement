import { Component } from '@angular/core';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-direct-password-reset',
  imports: [FormsModule],
  templateUrl: './direct-password-reset.html',
  styleUrl: './direct-password-reset.css'
})
export class DirectPasswordReset {
  username = '';
  newPassword = '';
  message = '';

  constructor(private auth: AuthService, private router: Router) {}

  reset() {
    this.auth.resetPasswordDirect({ username: this.username, newPassword: this.newPassword})
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = 'Password succesfully reset!';
          this.router.navigate(['/login']);
          
        },
        error: err => {
          console.error(err);
          this.message = 'User not found or error occured!'}
      });
  }

}
