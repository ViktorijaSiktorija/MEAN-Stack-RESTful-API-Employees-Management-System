import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';
import { MatCardModule } from '@angular/material/card';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'app-login-user',
  standalone: true,
  imports: [LoginFormComponent, MatCardModule],
  templateUrl: './login-user.component.html',
})
export class LoginUserComponent {
  constructor(private router: Router, private userService: UserService) {}

  loginUser(user: User) {
    console.log('Logging in user:', user);
    this.userService.loginUser(user).subscribe({
      next: (response: any) => {
        // Save token to localStorage
        if (response.token) {
          this.userService.storeToken(response.token);
          this.router.navigate(['/']);
        } else {
          alert('Login successful but token not received.');
        }
      },
      error: (error) => {
        alert('Failed to login');
        console.error(error);
      },
    });
  }
}
