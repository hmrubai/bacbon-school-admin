import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from 'src/app/_helpers/must-match.validator';
import { CommonService } from 'src/app/_services/common.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  userEmail: string;
  code: string;
  resetPasswordForm: FormGroup;
  submitted = false;

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    public formBuilder: FormBuilder,
    private toastr: ToastrService,
    private service: CommonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userEmail = this.route.snapshot.paramMap.get("email");
    this.code = this.route.snapshot.paramMap.get("code");
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      email: [this.userEmail, [Validators.required]],
      new_password: [null, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [null, Validators.required]
    }, {
      validator: MustMatch('new_password', 'confirmPassword')
    });
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.blockUI.start('Saving data...');

    const obj = {
      Email: this.resetPasswordForm.value.email,
      NewPassword: this.resetPasswordForm.value.new_password,
      ConfirmPassword: this.resetPasswordForm.value.confirmPassword,
      Code: this.code
    };

    this.service.post('account/set-new-password', obj).subscribe(
      res => {
        this.blockUI.stop();
        if (res.Success) {
          this.router.navigate(['/']);
          this.toastr.success(res.Message, 'Success!', { timeOut: 2000 });
        } else {
          this.toastr.error(res.Message, 'Error!', { timeOut: 5000 });
        }
      },
      error => {
        this.blockUI.stop();
        this.toastr.error('change-password', 'Error!', { timeOut: 5000 });
      }
    );

  }

}
