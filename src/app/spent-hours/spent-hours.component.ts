import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from '../../environments/environment';
//import { Page } from '../_models/page';


@Component({
  selector: 'app-configuration',
  templateUrl: './spent-hours.component.html',
  styleUrls: ['./spent-hours.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SpentHoursComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Create Configuration';
  btnSaveText = 'Save';
  limit: Number = 5;
  TotalExamSpentTime: any;
  TotalVideoSpentTime: any;
  TotalScriptTime: any;

  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  baseUrl;
  logoURL: any;
  signatureURL: any;
  public message: string;

  Videos = { list: [], total: 0 };
  Tests = { list: [], total: 0 };
  Scripts = { list: [], total: 0 };
  // page = new Page();
  isCollapsed: boolean = false;
  rows = [];
  classes = [];
  roleTypes: Array<any> = [{ id: 'Anonymous', text: 'Anonymous' }, { id: 'Restricted', text: 'Restricted' }];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  counter = { Scripts: 0, Videos: 0, SmallTests: 0 };
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
    this.GetTotalExamSpentTime();
    this.GetTotalVideoSpentTime();
    this.GetTotalScriptSpentTime();

    this.getClassWiseSubjects();
  }

  getClassWiseSubjects() {
    this._service.get('Learner/GetClassWiseSubjects').subscribe(res => {
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }

      res.Data.forEach(academicClass => {
        academicClass.collapsed = false;
        this.classes.push(academicClass);
      });
      this.loadClassWiseHours();
    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  loadClassWiseHours() {
    this.classes.forEach(academicClass => {
      academicClass.Videos = null
      academicClass.Scripts = null
      academicClass.Tests = null
      academicClass.TestsCount = 0
      academicClass.VideosCount = 0
      academicClass.ScriptsCount = 0
      this.GetLearnerWiseVideoSpentList(academicClass);
      this.GetLearnerWiseScriptList(academicClass);
      this.GetLearnerWiseSmallExamList(academicClass);
      this.getAllCount(academicClass);
      // academicClass.Subjects.forEach(element => {
      //   element.ChartOptions = null;
      //   this.getLearnerVideoHistory(element);
      // });
    });
  }

  GetTotalExamSpentTime() {
    const obj = {
      schoolId: null,
      classId: null
    }
    this._service.get('Learner/GetTotalExamSpentTime',obj).subscribe(res => {
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.TotalExamSpentTime = res.Data;

    }, err => {
      this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });

  }

  GetTotalVideoSpentTime() {
    const obj = {
      schoolId: null,
      classId: null
    }
    this._service.get('Learner/GetTotalVideoSpentTime',obj).subscribe(res => {
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.TotalVideoSpentTime = res.Data;

    }, err => {
      this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });

  }
  GetTotalScriptSpentTime() {
    const obj = {
      schoolId: null,
      classId: null
    }
    this._service.get('Learner/GetTotalScriptSpentTime',obj).subscribe(res => {
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.TotalScriptTime = res.Data;

    }, err => {
      this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });

  }
  getAllCount(item: any) {
    this._service.get('Learner/GetSpendHoursCount/' + item.ID).subscribe(res => {
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      item.ScriptsCount = res.Data.Scripts;
      item.VideosCount = res.Data.Videos;
      item.TestsCount = res.Data.SmallTests;

    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }
  GetLearnerWiseScriptList(item: any) {
    this._service.get('Learner/GetLearnerWiseScriptList/' + item.ID + "/" + this.limit).subscribe(res => {
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      item.Scripts = res.Data;
      //this.ExamList.total = res.Total;
    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    }
    );
  }

  GetLearnerWiseSmallExamList(item: any) {
    this._service.get('Learner/GetLearnerWiseSmallExamList/' + item.ID + "/" + this.limit).subscribe(res => {
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      item.Tests = res.Data;
      //this.ExamList.total = res.Total;
    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    }
    );
  }

  GetLearnerWiseVideoSpentList(item: any) {
    this._service.get('Learner/GetLearnerWiseVideoSpentList/' + item.ID + "/" + this.limit).subscribe(res => {
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      item.Videos = res.Data;
      //this.ExamList.total = res.Total;
    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    }
    );
  }

  downloadSampleVideo() {
    return this._service.downloadFile('Learner/GetLearnerWiseVideoSpentListExcel').subscribe(res => {
      const url = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = url;
      link.download = "video-spend-hours.xlsx";
      link.click();

    },
      error => {
        this.toastr.warning(error.message || error, 'Error!', { timeOut: 2000, closeButton: true, disableTimeOut: false, enableHtml: true });
      });
  }

  downloadSampleTest() {
    return this._service.downloadFile('Learner/GetLearnerWiseSmallExamListExcel').subscribe(res => {
      const url = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = url;
      link.download = "test-spend-hours.xlsx";
      link.click();

    },
      error => {
        this.toastr.warning(error.message || error, 'Error!', { timeOut: 2000, closeButton: true, disableTimeOut: false, enableHtml: true });
      });
  }

  downloadSampleExam() {
    return this._service.downloadFile('Learner/GetLearnerWiseBigExamListExcel').subscribe(res => {
      const url = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = url;
      link.download = "exam-spend-hours.xlsx";
      link.click();

    },
      error => {
        this.toastr.warning(error.message || error, 'Error!', { timeOut: 2000, closeButton: true, disableTimeOut: false, enableHtml: true });
      });
  }

}
