import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/_services/common.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  submitted: boolean = false;
  request_sent: boolean = false;
  resetForm: FormGroup;

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    public formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _service: CommonService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]]
    });
  }

  get f() {
    return this.resetForm.controls;
  }


  onFormSubmit() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }
    this.blockUI.start('Sending password reset request. Please wait...');

    this._service.get('account/forget-password', { email: this.resetForm.value.email.trim() }).subscribe(res => {
      this.blockUI.stop();
      if (!res.Success) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 3000 });
        return;
      }
      // this.toastr.success(res.Message, 'Success!', { timeOut: 3000 });
      this.request_sent = true;
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.message || err, 'Error!', { timeOut: 3000 });
    }
    );
  }

}
