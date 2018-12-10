import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterService } from '../services/router.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = new FormControl();
  password = new FormControl();

  invalidLogin: Boolean;
  submitMessage: string;

  constructor(private routerSvc: RouterService,
    private authSvc: AuthenticationService) { }

  loginSubmit() {
    const credentials = {
      'username': this.username.value,
      'password': this.password.value,
    };

    if (!this.username.value || !this.password.value) {
      this.submitMessage = 'Username and Passwrod required';
    } else {
      const authObs = this.authSvc.authenticateUser(credentials);

      authObs.subscribe(
        resp => {
          if (resp) {
            this.authSvc.setBearerToken(resp);
            this.invalidLogin = false;
            this.routerSvc.routeToDashboard();

          } else {
            this.authSvc.removeBearerToken();
            this.submitMessage = 'Unauthorized';
            this.invalidLogin = true;
          }
        },
        err => {
          this.authSvc.removeBearerToken();
          if (err.error) {
            this.submitMessage = err.error.message;
          } else {
            this.submitMessage = err.message;
          }
          this.invalidLogin = true;
        }
      );
    }
  }
}
