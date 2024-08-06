import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './../../_services/authentication.service';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  LoginForm: FormGroup;
  submitted = false;
  returnUrl: string;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return;
    }
  }

  ngOnInit() {
    this.LoginForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.LoginForm.controls;
  }

  onLoginSubmit() {
    this.submitted = true;
    if (this.LoginForm.invalid) {
      return;
    }
    this.blockUI.start('Signing in ...');

    this.authService.login({ UserName: this.LoginForm.value.Email, Password: this.LoginForm.value.Password }).subscribe(
      data => {
        this.blockUI.stop();
        console.log(data);
        if (data.status) {
          this.toastr.success('Successfully logged in.', 'Success!', { timeOut: 2000 });
          this.router.navigate([this.returnUrl]);
        }else{
          this.toastr.warning(data.messages, 'Attention!', { timeOut: 2000 });
          //this.router.navigate([this.returnUrl]);
        }
      },
      error => {
        this.blockUI.stop();
        if (error.status === 400) {
          this.toastr.error('Unauthorized request found', 'Success!', { timeOut: 3000 });
        } else if (error.status === 401) {
          this.toastr.error('Invalid Email Or Password', 'Success!', { timeOut: 3000 });
        }
      }
    );

  }

}
