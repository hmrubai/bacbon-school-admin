import {
  Component,
  TemplateRef,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  OnInit
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from "@angular/router";

import { ToastrService } from "ngx-toastr";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { CommonService } from "src/app/_services/common.service";
import { MustMatch } from "src/app/_helpers/must-match.validator";
import { AuthorizationService } from "src/app/_services/authorization.service";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { PasswordValidator } from "src/app/_helpers/password-validator";
import { MustNotMatch } from "src/app/_helpers/must-not-match.validator";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  submitted = false;
  currentUser: any;
  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private authService: AuthenticationService,
    private toastr: ToastrService
  ) {
    this.currentUser = this.authService.currentUserDetails.value;
  }

  ngOnInit() {

    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6), PasswordValidator.strong]],
      confirmPassword: ['', Validators.required],

    }, {
      validator: [MustMatch('newPassword', 'confirmPassword'), MustNotMatch('newPassword', 'oldPassword')],
    });

  }
  get f() {
    return this.changePasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.blockUI.start('Saving data...');

    const obj = {
      Email: this.currentUser.Email,
      OldPassword: this.changePasswordForm.value.oldPassword.trim(),
      NewPassword: this.changePasswordForm.value.newPassword.trim(),
      ConfirmPassword: this.changePasswordForm.value.confirmPassword.trim()
    };

    this._service.post('account/change-password', obj).subscribe(
      res => {
        this.blockUI.stop();
        if (!res.Success) {
          this.toastr.warning(res.Message, 'Error!', { timeOut: 2000 });
          return;
        }
        this.toastr.success(res.Message, 'Success!', { timeOut: 2000 });
        this.submitted = false;
        this.changePasswordForm.reset();
      },
      error => {
        this.toastr.warning(error.message || error, 'Warning!', { timeOut: 2000 });
        this.blockUI.stop();
      }
    );

  }



}
