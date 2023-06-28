import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  public registerForm!: FormGroup;
  public isRegistering: boolean = false;
  public pwVisible: boolean = false;
  private message: string = '';
  public namePattern = "[a-zA-Z]+";
  public passwordPattern ="(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}";
  public emailPattern ="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$";

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.registerForm = new FormGroup({
      'firstname': new FormControl('', [Validators.required, Validators.pattern(this.namePattern), Validators.minLength(2), Validators.maxLength(12)]),
      'lastname': new FormControl('', [Validators.required, Validators.pattern(this.namePattern), Validators.minLength(2), Validators.maxLength(12)]),
      'email': new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      'password': new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)])
    });
  }


  register() {
    this.isRegistering = true;
    from(this.authenticationService.register(this.registerForm.value)).subscribe(() => {
      this.isRegistering = false;
      this.message = 'You have registered succesfully. You will be directed to the login page.';
      this.showMessage(this.message);
      this.navigateToLogin();
    }, (error: any) => {
      this.isRegistering = false;
      this.message = 'We are sorry, but the registration has failed. Please check the required fields!'
      this.showMessage(this.message);
    })
  }


  navigateToLogin() {
    setTimeout(() => {
      this.router.navigate(['login']);
      this.registerForm.reset();
    }, 3000);
  }


  showMessage(message: string) {
    this.snackbar.open(message, "OK", {
      duration: 4000
    })
  }
}
