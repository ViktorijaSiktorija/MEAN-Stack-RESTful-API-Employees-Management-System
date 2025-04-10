import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';
import { MatCardModule } from '@angular/material/card';
import { RegisterFormComponent } from '../register-form/register-form.component';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [RegisterFormComponent, MatCardModule],
  templateUrl: './register-user.component.html',
})
export class AddUserComponent {
  constructor(private router: Router, private userService: UserService) {}

  addUser(user: User) {
    console.log('Adding user:', user);
    this.userService.createUser(user).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Failed to create employee');
        console.error(error);
      },
    });
  }
}
