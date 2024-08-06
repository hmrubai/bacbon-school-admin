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
  selector: 'app-default',
  templateUrl: './default.component.html',
  encapsulation: ViewEncapsulation.None
})

export class DefaultComponent implements OnInit {

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
  from = null;
  to = null;
  IsChanged = false;
  signatureURL: any;
  public message: string;

  logoFile: any = null;
  signatureFile: any = null;
  selectedWeekend = [];
  weekends = [
    { id: 6, name: "Saturday", selected: false },
    { id: 0, name: "Sunday", selected: false },
    { id: 1, name: "Monday", selected: false },
    { id: 2, name: "Tuesday", selected: false },
    { id: 3, name: "Wednesday", selected: false },
    { id: 4, name: "Thursday", selected: false },
    { id: 5, name: "Friday", selected: false },
  ];
  interval: any;
  intervalList = [{ Id: 5, Name: "After 5 mins" },
  { Id: 10, Name: "After 10 mins" },
  { Id: 15, Name: "After 15 mins" },
  { Id: 20, Name: "After 20 mins" },
  { Id: 30, Name: "After 30 mins" },
  { Id: 60, Name: "After 1 hour" },
  { Id: 0, Name: "Random" },
  ];
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

    this.setupForm = this.formBuilder.group({
      id: [null],
      weekdays: [null],
      interval: [null, [Validators.required]],
      from: ["", [Validators.required]],
      to: ["", [Validators.required]],
      // startMonth: [null, [Validators.required]],

    });

    this.getDefaultScheduleItem();
  }

  get f() {
    return this.setupForm.controls;
  }
  onChange(id, isChecked: boolean) {

    var item = this.weekends.filter(x => x.id === id)[0]
    item.selected = isChecked

  }

  getDefaultScheduleItem() {
    this.blockUI.start('Getting data...');
    this._service.get('company/default-schedule/get').subscribe(res => {
      this.blockUI.stop();
      if (!res.Success) {
        this.toastr.error(res.Message, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
        return;
      }
      if (res.Record) {
        
        this.btnSetupSaveText = 'Update Default Schedule';
        if (res.Record.StartTime) this.setupForm.controls['from'].setValue(res.Record.StartTime);
        if (res.Record.EndTime) this.setupForm.controls['to'].setValue(res.Record.EndTime);
        this.setupForm.controls['interval'].setValue(res.Record.CapInterval);

        res.Record.WorkingWeekDays.forEach(element => {
          this.weekends.filter(x => x.id === element)[0].selected = true;
        })
        this.submitted = false
      }
    },
      err => {
        this.blockUI.stop();
        this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
      });
  }
  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }





  onScheduleSubmit() {
    this.submitted = true;

    let beginningTime = moment(this.setupForm.value.from, 'h:mma');
    let endTime = moment(this.setupForm.value.to, 'h:mma');
    // console.log(beginningTime.isBefore(endTime)); 
    if(!beginningTime.isBefore(endTime)){
      this.toastr.warning('Capture time is invalid', 'Warning!', { timeOut: 2000 });
      return; 
    } 

    if (this.weekends.filter(x=>x.selected===true).length<=0) {
      this.toastr.warning('Please select week days before proceeding', 'Warning!', { timeOut: 2000 });
      return;
    }

    this.blockUI.start('Saving...');

    const obj = {
      // StartMonth: moment(this.entryForm.value.startMonth).format('DD-MMM-YYYY'),
      WorkingWeekDays: this.weekends.filter(x => x.selected == true).map(x => x.id),
      StartTime: moment().format('DD-MMM-YYYY') + ' ' + this.setupForm.value.from,
      EndTime: moment().format('DD-MMM-YYYY') + ' ' + this.setupForm.value.to,
      CapInterval: this.setupForm.value.interval,
      CapRandom: this.setupForm.value.interval == 0 ? true : false
    };



    this._service.post('company/default-schedule/create-or-update', obj).subscribe(
      data => {
        this.blockUI.stop();
        if (data.Success) {
          this.toastr.success(data.Message, 'Success!', { timeOut: 2000 });

          this.IsChanged = false;

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

  modalHide() {
    this.setupForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Create Role';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    this.setupForm.controls['isActive'].setValue(true);
    this.modalRef = this.modalService.show(template, this.modalConfig);
  }

}
