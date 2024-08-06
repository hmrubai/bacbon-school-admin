import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from '../../environments/environment';
import { ResponseStatus } from '../_models/enum';
//import { Page } from '../_models/page';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-configuration',
  templateUrl: './school-wise-spent-hours-report.component.html',
  styleUrls: ['./school-wise-spent-hours-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SchoolWiseSpentHoursReportComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Create Configuration';
  btnSaveText = 'Save';
  limit: Number = 5;


  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  baseUrl;
  logoURL: any;
  signatureURL: any;
  public message: string;
  schoolId: number = null;

  scriptCollapsed: boolean = true;
  videoCollapsed: boolean = true;
  smallTestCollapsed: boolean = true;
  graphCollapsed: boolean = true;

  TotalExamSpentTime: any;
  TotalVideoSpentTime: any;
  TotalScriptTime: any;

  Videos = { list: [], total: 0 };
  Tests = { list: [], total: 0 };
  Scripts = { list: [], total: 0 };
  // page = new Page();
  isCollapsed: boolean = true;
  rows = [];
  classes = [];
  roleTypes: Array<any> = [{ id: 'Anonymous', text: 'Anonymous' }, { id: 'Restricted', text: 'Restricted' }];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  counter = { Scripts: 0, Videos: 0, SmallTests: 0 };
  scrollBarHorizontal = (window.innerWidth < 1200);

  highcharts = Highcharts;
  charts: Array<any> = [];

  schoolList: Array<any> = [];
  subjects: Array<{
    ID?: number;
    Name?: string;
    Videos?: Array<any>;
    Scripts?: Array<any>;
    SmallTests?: Array<any>;
    ChartOptions?: any;
  }> = [];

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
   this.GetTotalExamSpentTime(null);
   this.GetTotalVideoSpentTime(null);
   this.GetTotalScriptSpentTime(null);
    this.GetSchoolList();
  }

  GetSchoolList() {

    this._service.get('Learner/GetSchoolWiseClasses').subscribe(res => {
      if (res.Status === ResponseStatus.WARNING) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === ResponseStatus.ERROR) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.schoolList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  onChangeSchool(event) {
    this.classes = [];
    this.loadClassBySchool(event.ID);
  }

  loadClassBySchool(id) {
    this.schoolList.filter(x => x.ID === id).forEach(school => {
      this.classes = school.Classes
      this.classes.forEach(element => {
        element.collapsed = true;
        element.scriptCollapsed = true;
        element.videoCollapsed = true;
        element.smallTestCollapsed = true;
        element.graphCollapsed = true;
        element.TotalExamSpentTime = null;
        element.TotalVideoSpentTime = null;
        element.TotalScriptTime = null;

        element.subjects = [],
        this.getSubjects(element, element.ID);
        this.GetTotalExamSpentTime(element);
        this.GetTotalVideoSpentTime(element);
        this.GetTotalScriptSpentTime(element);
      });
    });
  }

  getSubjects(item, classId: number) {
    this._service.get('Master/GetSubjectList/' + classId).subscribe(res => {
      if (res.Status === ResponseStatus.WARNING) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === ResponseStatus.ERROR) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }

      res.Data.forEach(element => {
        item.subjects.push({
          ID: element.ID,
          Name: element.SubjectName_en,
          Videos: [],
          Scripts: [],
          ChartOptions: null
        });
      });
      this.loadSubjectWiseData(item);
    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  loadSubjectWiseData(item) {
    item.subjects.forEach(element => {
      element.ChartOptions = null;
      this.getLearnerVideoHistory(element);
      this.getLearnerVideoScriptHistory(element);
      this.getLearnerSmallTestHistory(element);
    });
  }

  getLearnerVideoHistory(subject: {
    ID?: number;
    Name?: string;
    Videos?: Array<any>;
    Scripts?: Array<any>;
    SmallTests?: Array<any>;
    ChartOptions?: any;
  }) {
    const obj = {
      subjectId: subject.ID,
      schoolId: this.schoolId
    }
    this._service.get('Learner/GetLearnerVideoHistoryBySchool', obj).subscribe(res => {
      this.blockUI.stop();
      if (res.Status === ResponseStatus.WARNING) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === ResponseStatus.ERROR) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      subject.Videos = res.Data;
      let nameArr = [];
      let dataArr = [];
      res.Data.forEach(element => {
        nameArr.push(element.Name);
        dataArr.push({
          y: element.SeenDurationSec / 60,
          mint: Math.floor(element.SeenDurationSec / 60),
          sec: element.SeenDurationSec % 60,
          name: element.Name
        });
      });
      subject.ChartOptions = {
        chart: {
          type: "area",
          scrollablePlotArea: {
            minWidth: 700,
            scrollPositionX: 1
          }
        },
        title: {
          text: "Video Seen Progress | " + subject.Name
        },
        xAxis: {
          categories: nameArr,
          labels: {
            rotation: 90,
            style: {
              fontSize: "9px"
              // fontFamily: 'Verdana, sans-serif'
            },
            overflow: 'justify'
          }
        },

        yAxis: {
          labels: {
            format: "{value}"
          },
          title: {
            text: "Duration (minute)"
          }
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          area: {
            fillOpacity: 0.5
          },
          series: {
            borderWidth: 0,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "{point.mint: .0f} mint {point.sec: .0f} sec"
            }
          }
        },
        tooltip: {
          headerFormat:
            '<span style="font-size:11px">{series.name}</span><br>',
          pointFormat:
            "<span >{point.name}</span>: <b>{point.mint: .0f} mint {point.sec: .0f} sec <br/>"
        },

        series: [
          {
            name: "Watched Duration",
            data: dataArr
          }
        ]
      };
    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    }
    );
  }

  getLearnerVideoScriptHistory(subject: {
    ID?: number;
    Name?: string;
    Videos?: Array<any>;
    Scripts?: Array<any>;
    SmallTests?: Array<any>;
    ChartOptions?: any;
  }) {
    const obj = {
      subjectId: subject.ID,
      schoolId: this.schoolId,
    }
    this._service.get('Learner/GetLearnerVideoScriptHistoryBySchool', obj).subscribe(res => {
      this.blockUI.stop();
      if (res.Status === ResponseStatus.WARNING) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === ResponseStatus.ERROR) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      subject.Scripts = res.Data;
    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    }
    );
  }

  getLearnerSmallTestHistory(subject: {
    ID?: number;
    Name?: string;
    Videos?: Array<any>;
    Scripts?: Array<any>;
    SmallTests?: Array<any>;
    ChartOptions?: any;
  }) {
    const obj = {
      subjectId: subject.ID,
      schoolId: this.schoolId,
    }
    this._service.get('Learner/GetLearnerSmallTestHistoryBySchool', obj).subscribe(res => {
      if (res.Status === ResponseStatus.WARNING) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === ResponseStatus.ERROR) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      subject.SmallTests = res.Data;
    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    }
    );
  }

  GetTotalExamSpentTime(item) {
    const obj = {
      schoolId: this.schoolId,
      classId: item ? item.ID : null
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
      item ? item.TotalExamSpentTime = res.Data : this.TotalExamSpentTime=res.Data;

    }, err => {
      this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });

  }

  GetTotalVideoSpentTime(item) {
    const obj = {
      schoolId: this.schoolId,
      classId: item ? item.ID : null
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
      item ? item.TotalVideoSpentTime = res.Data : this.TotalVideoSpentTime=res.Data;
    }, err => {
      this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });

  }

  GetTotalScriptSpentTime(item) {
    const obj = {
      schoolId: this.schoolId,
      classId: item ? item.ID : null
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
      item ? item.TotalScriptTime = res.Data : this.TotalScriptTime=res.Data;
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


 
}
