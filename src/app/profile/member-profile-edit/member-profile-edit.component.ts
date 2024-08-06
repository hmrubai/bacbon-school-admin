import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { CommonService } from '../../_services/common.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { environment } from '../../../environments/environment'


@Component({
  selector: 'app-member-profile-edit',
  templateUrl: './member-profile-edit.component.html',
  styleUrls: ['./member-profile-edit.component.css']
})
export class MemberProfileEditComponent implements OnDestroy, OnInit {

  baseUrl = environment.baseUrl;
  picURL: any;
  picFile: any = null;
  currentUser: any;
  @BlockUI() blockUI: NgBlockUI;
  fullFormArray: any;
  editProfileForm: FormGroup;
  historyList: FormArray;
  imageFile: any;
  imageUrl: string | ArrayBuffer;
  bsConfig: Partial<BsDatepickerConfig>;
  maxDate: Date;
  genderList = ["Male", "Female", "Other"];
  submitted = false;
  today: Date;
  selectedGender: any;

  constructor(
    private formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthenticationService,
  ) {
    this.currentUser = this.authService.currentUserDetails.value;
    this.today = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
    // this.bsConfig = Object.assign({}, { containerClass: 'theme-blue' });
  }

  ngOnInit(): void {
    // this.loadJquery();

    this.bsConfig = Object.assign({}, {
      isAnimated: true,
      adaptivePosition: true,
      dateInputFormat: 'DD MMM YYYY'
    });

    this.getItem();

    this.editProfileForm = this.formBuilder.group({
      //contactNo: [null, [Validators.required]],
      firstName: [null, [Validators.required, Validators.maxLength(50)]],
      lastName: [null, [Validators.required, Validators.maxLength(50)]],
      //presentAddress: [null],
      //permanentAddress: [null],
      //gender: [null]
    });


  }

  get f() {
    return this.editProfileForm.controls;
  }

  ngOnDestroy() {
    // (function($) {
    //   $("header").removeClass("default-header");   
    // })($);
  }

  getItem() {
    this.blockUI.start('Getting data...');
    this._service.get('Master/get-profile').subscribe(res => {
      this.blockUI.stop();
      if (!res.Success) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      let dateOfBirth = new Date(res.Record.DateOfBirth);
      dateOfBirth.setMinutes(dateOfBirth.getMinutes() + 360);

      console.log(res.Record)
     
      this.editProfileForm.controls['firstName'].setValue(res.Record.FirstName);
      this.editProfileForm.controls['lastName'].setValue(res.Record.LastName);
     

      if (res.Record.ImagePath) this.imageUrl = this.baseUrl + res.Record.ImagePath;
    }, err => {
      this.blockUI.stop();
      this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });

  }

  onFormSubmit() {
    this.submitted = true;
    if (this.editProfileForm.invalid) {
      return;
    }

    this.blockUI.start('Saving...');


    const obj = {

     // ContactNo: this.editProfileForm.value.contactNo.trim(),
      FirstName: this.editProfileForm.value.firstName.trim(),
      LastName: this.editProfileForm.value.lastName.trim(),
     // PresentAddress: this.editProfileForm.value.presentAddress ? this.editProfileForm.value.presentAddress.trim() : null,
     // PermanentAddress: this.editProfileForm.value.permanentAddress ? this.editProfileForm.value.permanentAddress.trim() : null,
     // Gender: this.editProfileForm.value.gender.trim(),
    };

    this._service.post('Master/update-profile', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.Success) {
          this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });

          this.currentUser.FirstName = obj.FirstName;
          this.currentUser.LastName = obj.LastName;
          this.currentUser.FullName = obj.FirstName + ' ' +obj.LastName;
          //this.currentUser.Gender = obj.Gender;
          this.authService.updateCurrentUser(this.currentUser);
          this.submitted = false;
          this.getItem();

        } else {
          this.toastr.error(data.Message, 'Error!', { timeOut: 2000 });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
      }
    );

  }

  onPhotoSubmit() {
   
    let formData = new FormData();
  
    if (this.imageFile) formData.append('Picture', this.imageFile);

    this._service.post('Master/update-photo', formData).subscribe(
      data => {
        //this.blockUI.stop();
        if (data.Success) {
          this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });
          this.authService.updateImage(data.ImagePath);
          
        } else {
          this.toastr.error(data.Message, 'Error!', { timeOut: 2000 });
        }
      },
      err => {
        //this.blockUI.stop();
        this.toastr.error(err.message || err, 'Error!', { timeOut: 2000 });
      }
    );

  }
  RemovePhoto() {
    this.imageFile = [];
    this.imageUrl = null;
    this.onPhotoSubmit();
  }


  readURL(event: any, input) {
    if (!input || input.files.length === 0)
      return;

    var mimeType = input.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.toastr.warning("Only images are supported", 'Warning!!');
      return;
    }

    var reader = new FileReader();

    this.imageFile = input.files[0];
    reader.readAsDataURL(input.files[0]);
    reader.onload = (_event) => {
      this.imageUrl = reader.result;
    }
    this.onPhotoSubmit();
  }








}
