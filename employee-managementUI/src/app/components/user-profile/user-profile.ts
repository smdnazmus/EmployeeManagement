import { Component, OnInit } from '@angular/core';
import { User } from '../../models/userModel';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';


@Component({
  selector: 'app-user-profile',
  imports: [RouterModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
  user: any;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getUser(id).subscribe(u => this.user = u);
  }

  updateProfile() {
    const updateUsername = prompt("Update Username", this.user.username);
    const updateEmail = prompt("Update Email", this.user.email);

    if (updateUsername && updateEmail) {
      const updated = { ...this.user, username: updateUsername, email: updateEmail };
      this.userService.updateUser(this.user.id, updated).subscribe(() => {
        this.user.username = updateUsername;
        this.user.email = updateEmail;
      }); 
    }
  }
}
