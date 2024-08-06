import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from '../../environments/environment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';
//import { Page } from '../_models/page';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SystemConfigurationComponent implements OnInit {

  entryForm: FormGroup;
  setupForm: FormGroup;
  submitted = false;
  CompanyExists = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Create Configuration';
  btnSaveText = 'Save';
  btnSetupSaveText = 'Setup Default Schedule';
  timeNow = new Date();
  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  baseUrl;
  logoURL: any;
  from=null;
  to=null;
  IsChanged=  false;
  signatureURL: any;
  public message: string;

  logoFile: any = null;
  signatureFile: any = null;
 
  // page = new Page();
  bsConfig: Partial<BsDatepickerConfig>;
  rows = [];
  roleTypes: Array<any> = [{ id: 'Anonymous', text: 'Anonymous' }, { id: 'Restricted', text: 'Restricted' }];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);

  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.baseUrl = environment.baseUrl;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }


  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.maxLength(250)]],
      email: [null, [Validators.required, Validators.email]],
      address: [null,[Validators.maxLength(250)]],
      website: [null,[Validators.maxLength(250)]],
      phone: [null, [Validators.required,Validators.maxLength(250)]],
      logo: [null],
      weekdays: [null],
      interval: [null],
      from: [null],
      to: [null],
      // startMonth: [null, [Validators.required]],

    });
   
    this.getItem();
    
  }

  get f() {
    return this.entryForm.controls;
  }

  
  getItem() {
    this.blockUI.start('Getting data...');
    this._service.get('company/get').subscribe(res => {
      this.blockUI.stop();
      if (!res.Success) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
        return;
      }
      if (res.Record) {
        console.log(res.Record.Holidays)
       this.CompanyExists=true;
        this.timeNow = new Date(res.Record.StartMonth);
        this.btnSaveText = 'Update';
        this.entryForm.controls['id'].setValue(res.Record.Id);
        this.entryForm.controls['name'].setValue(res.Record.Name);
        this.entryForm.controls['address'].setValue(res.Record.Address);
        this.entryForm.controls['phone'].setValue(res.Record.ContactNo);
        this.entryForm.controls['email'].setValue(res.Record.Email);
        this.entryForm.controls['website'].setValue(res.Record.CompanyWebsite);
        // this.entryForm.controls['startMonth'].setValue(this.timeNow);
       // this.entryForm.controls['weekend'].setValue(res.Record.Holidays);
        this.logoURL = this.baseUrl + res.Record.LogoPath;
        
      }
    }, err => {
      this.blockUI.stop();
      this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
    });
  }
 
  
  
  preview(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.logoFile = files[0];
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.logoURL = reader.result;
    }
  }


  

  onFormSubmit() {
    this.submitted = true;



    if (this.entryForm.invalid) {
      return;
    }

    this.blockUI.start('Saving...');

    const obj = {
      Name: this.entryForm.value.name.trim(),
      Address: this.entryForm.value.address ? this.entryForm.value.address.trim() : null,
      ContactNo: this.entryForm.value.phone.trim(),
      Email: this.entryForm.value.email.trim(),
      CompanyWebsite: this.entryForm.value.website ? this.entryForm.value.website.trim() : null,
      // StartMonth: moment(this.entryForm.value.startMonth).format('DD-MMM-YYYY'),
      Holidays: this.entryForm.value.weekend,

    };


    const configurationFormdata = new FormData();
    configurationFormdata.append('Model', JSON.stringify(obj));
    configurationFormdata.append('Logo', this.logoFile);


    this._service.post('company/create-or-update', configurationFormdata).subscribe(
      data => {
        this.blockUI.stop();
        if (data.Success) {
          this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });

          this.IsChanged=false;

        } else {
          this.toastr.error(data.Message, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
        }
      },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
      }
    );

  }

  

  
}
