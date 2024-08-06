import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthenticationService } from '../_services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

// import * as moment from 'moment';

@Component({
  selector: 'app-user-group-entry',
  templateUrl: './user-group-entry.component.html',
  encapsulation: ViewEncapsulation.None
})

export class UserGroupEntryComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  formTitle = 'Create User Group';
  isUpdate = false;
  saveButtonText: string = 'Save';
  @BlockUI() blockUI: NgBlockUI;
  permission;
  public permissionList: Array<any> = [];
  id;

  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    if (this.route.snapshot.queryParamMap.has("id")) {
      this.id = this.route.snapshot.queryParamMap.get("id");
    
    }
  }

  ngOnInit() {

    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required,Validators.maxLength(250)]],
      description: [null]
    });
    this.getPermisstionList();
  }

  get f() {
    return this.entryForm.controls;
  }


  getPermisstionList() {
    this.blockUI.start('Getting data. Please wait ...');
    this._service.get('user-group/permission/list').subscribe(res => {
      if (!res.Success) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      this.permissionList = [];
      res.Records.forEach(element => {
        this.permissionList.push({
          Id: element.Id,
          Name: element.Name.trim(),
          IsSelected: false
        })
      });


      if (this.id) this.getUserGroup(this.id);


      this.blockUI.stop();
    }, err => {
      this.blockUI.stop();
      this.toastr.warning(err.Message || err, 'Warning!', { timeOut: 2000 });
    });
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let permissions = [];
    permissions = this.permissionList.filter(x => x.IsSelected == true).map((x) => x.Id);

    if (permissions.length === 0) {
      this.toastr.warning('No Permission Selected!!', 'WARNING!', { timeOut: 3000 });
      return;
    }
    this.blockUI.start('Saving data...');
    const obj = {
      Id: this.entryForm.value.id ? this.entryForm.value.id : 0,
      Name: this.entryForm.value.name.trim(),
      Description: this.entryForm.value.description ? this.entryForm.value.description.trim() : null,
      Roles: permissions
    };

    this._service.post('user-group/create-or-update', obj).subscribe(
      res => {
        this.blockUI.stop();
        if (!res.Success) {
          this.toastr.warning(res, 'Warning!', { closeButton: true, disableTimeOut: false });
          return;
        }
        this.router.navigate(['/user-group-list']);
        this.toastr.success('Successfully Created', 'Success!', { timeOut: 2000 });

      },
      error => {
        this.toastr.warning(error.message || error, 'Warning!', { closeButton: true, disableTimeOut: false });
        this.blockUI.stop();
      }
    );

  }

  getUserGroup(id) {
    this._service.get('user-group/get/' + id).subscribe(res => {
      if (res.Success) {
        this.entryForm.controls['id'].setValue(res.Record.Id);
        this.entryForm.controls['name'].setValue(res.Record.Name);
        this.entryForm.controls['description'].setValue(res.Record.Description);

        this.permissionList.map(x => {
          x.IsSelected = res.Record.Roles.indexOf(x.Id) != -1
        });

        this.saveButtonText = 'Update';
        this.formTitle="Update User Group";
      }
    });

  }
  onChange(isChecked) {
    if(isChecked)
    {
      this.permissionList.map(x => {
        x.IsSelected = true
      });
      return;
    }
      this.permissionList.map(x => {
        x.IsSelected = false
      });

  }

}
