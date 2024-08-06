import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { trigger, transition, style, animate } from '@angular/animations';
import { MustMatch } from '../_helpers/must-match.validator';
import { PasswordValidator } from '../_helpers/password-validator';



@Component({
  selector: 'app-user-entry',
  templateUrl: './user-entry.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out',
              style({ height: 300, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            animate('1s ease-out',
              style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})

export class UserEntryComponent implements OnInit {

  id: string;
  isEdit: boolean;
  formTitle = 'Create User';
  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  btnSaveText = 'Save';
  userGroupId: any;
  userGroupList: Array<any> = [];
  permissionList: Array<any> = [];

  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    if (this.route.snapshot.queryParams.id) {
      this.id = this.route.snapshot.queryParams.id;
      this.isEdit = true;
    }
  }


  ngOnInit() {

    this.entryForm = this.formBuilder.group({
      id: [null],
      Email: [null, [Validators.required]],
      // Password: [null, [PasswordValidator.strong, Validators.required, Validators.minLength(6)]],
      Password: [null, [Validators.required, Validators.minLength(6)]],
      // ConfirmPassword: [null, [Validators.required]],
      FirstName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      LastName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      IsActive: [true, [Validators.required]],
      // UserGroupId: [null, [Validators.required]]
    });

    this.getPermisstionList();
  }

  get f() {
    return this.entryForm.controls;
  }


  getPermisstionList() {
    this.blockUI.start('Getting data. Please wait ...');
    this._service.get('account/permission/list').subscribe(res => {
      if (!res.Success) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      this.permissionList = [];
      res.Records.forEach(element => {
        this.permissionList.push({
          Id: element.Id,
          Name: element.Name,
          IsSelected: false
        })
      });
      if (this.id)
        this.getItem(this.id);
      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
      this.toastr.warning(err.Message || err, 'Warning!', { timeOut: 2000 });
    }
    );
  }


  getItem(id) {
    this.blockUI.start('Getting data...');
    this._service.get('account/get-user/' + id).subscribe(res => {
      this.blockUI.stop();
      if (!res.Success) {
        this.toastr.warning(res.Message, 'Warning!', { closeButton: true, disableTimeOut: false });
        return;
      }
      console.log(res.Record);
      this.formTitle = 'Update User';
      this.btnSaveText = 'Update';
      this.entryForm.controls['id'].setValue(res.Record.Id);
      this.entryForm.controls['FirstName'].setValue(res.Record.FirstName);
      this.entryForm.controls['LastName'].setValue(res.Record.LastName);
      this.entryForm.controls['Email'].setValue(res.Record.Email);
      this.entryForm.controls['Password'].setValue('************');
      // this.entryForm.controls['ConfirmPassword'].setValue('************');
      this.entryForm.controls['Email'].setValue(res.Record.Email);

      // this.entryForm.controls['UserGroupId'].setValue(res.Record.UserGroupId);
      this.entryForm.controls['IsActive'].setValue(res.Record.Active);
      this.permissionList.forEach(element => {
        element.IsSelected = res.Record.Roles.indexOf(element.Id) !== -1;
      });

    }, err => {
      this.blockUI.stop();
      this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }


  async onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    this.blockUI.start('Saving...');

    const obj = {
      Id: this.id || '',
      Email: this.entryForm.value.Email.trim(),
      Password: this.entryForm.value.Password.trim(),
      FirstName: this.entryForm.value.FirstName.trim(),
      LastName: this.entryForm.value.LastName.trim(),
      IsActive: this.entryForm.value.IsActive,
      // UserGroupId: this.entryForm.value.UserGroupId,
      Roles: this.permissionList.filter(x => x.IsSelected === true).map(x => x.Id)
    };

    const request = this._service.post('account/create-or-update-user', obj);

    request.subscribe(
      data => {
        this.blockUI.stop();
        if (data.Success) {
          this.toastr.success('Saved Successfully', 'User', { timeOut: 2000 });
          this.router.navigate(['/user-list']);
        } else {
          this.toastr.warning(data.Message, 'Warning!', { closeButton: true, disableTimeOut: false });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      }
    );
  }

  onSelectAll(event) {
    this.permissionList.forEach(element => {
      element.IsSelected = event.target.checked;
    });
  }
}
