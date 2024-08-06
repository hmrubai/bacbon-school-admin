import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from '../../environments/environment';
//import { Page } from '../_models/page';
import * as Highcharts from 'highcharts';
import { Page } from '../_models/page';
import { ResponseStatus } from '../_models/enum';

@Component({
   selector: 'app-learner-details',
   templateUrl: './learner-details.component.html',
   styleUrls: ['./learner-details.component.scss'],
   encapsulation: ViewEncapsulation.None
})

export class LearnerDetailsComponent implements OnInit {

   classId: number = null;
   submitted = false;
   @BlockUI() blockUI: NgBlockUI;
   modalTitle = 'Create Configuration';
   btnSaveText = 'Save';
   limit: Number = 5;
   page = new Page();

   scriptCollapsed: boolean = true;
   videoCollapsed: boolean = true;
   smallTestCollapsed: boolean = true;
   graphCollapsed: boolean = true;

   modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
   modalRef: BsModalRef;

   baseUrl;
   logoURL: any;
   signatureURL: any;
   public message: string;

   TestList = { list: [], total: 0 };
   callHistory = { list: [], total: 0 };
   videos = { list: [], total: 0 };
   videosCompleted = [];
   tests = [];
   subjects: Array<{
      ID?: number;
      Name?: string;
      Videos?: Array<any>;
      Scripts?: Array<any>;
      SmallTests?: Array<any>;
      ChartOptions?: any;
   }> = [];
   testCompleted = { list: [], total: 0 };
   exams = { list: [], total: 0 };
   examCompleted = { list: [], total: 0 };
   Learner: any = [];
   DeviceDetail: any = [];
   // page = new Page();
   id: any;
   rows = [];
   loadingIndicator = false;
   ColumnMode = ColumnMode;

   highcharts = Highcharts;
   charts: Array<any> = [];

   classList: Array<any> = [];

   TotalExamSpentTime: any;
   TotalVideoSpentTime: any;
   TotalScriptTime: any;

   scrollBarHorizontal = (window.innerWidth < 1200);
   @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
   constructor(
      public formBuilder: FormBuilder,
      private _service: CommonService,
      private toastr: ToastrService,
      private router: Router,
      private route: ActivatedRoute,
      private modalService: BsModalService,
   ) {
      if (this.route.snapshot.paramMap.has("id")) {
         this.id = this.route.snapshot.paramMap.get("id");
      }
      this.baseUrl = environment.baseUrl;
      window.onresize = () => {
         this.scrollBarHorizontal = (window.innerWidth < 1200);
      };

      this.page.pageNumber = 1;
      this.page.size = 5;
   }



   ngOnInit() {
      this.GetLearnerDetaileById();
      this.getClassList();
      
   }

   getAllCount(classId) {
      this._service.get('Learner/GetSpendHoursCountByLearner/' + this.id +"/"+classId).subscribe(res => {
        if (res.Status === 2) {
          this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
          return;
        }
        else if (res.Status === 1) {
          this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
          return;
        }
        this.TotalScriptTime = res.Data.Scripts;
        this.TotalVideoSpentTime = res.Data.Videos;
        this.TotalExamSpentTime = res.Data.SmallTests;
  
      }, err => {
        this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      });
    }

   getClassList() {
      this._service.get('Master/GetClassList').subscribe(res => {
         if (res.Status === ResponseStatus.WARNING) {
            this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
            return;
         }
         else if (res.Status === ResponseStatus.ERROR) {
            this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
            return;
         }
         this.classList = res.Data;
 
      }, err => {
         this.toastr.warning(err.message || err, 'warning!', { closeButton: true, disableTimeOut: false });
      });
   }

   onChangeClass(event) {
      this.subjects = [];
      this.getSubjects(event.ID);
      this.getAllCount(event.ID);
   }

   getSubjects(classId: number) {
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
            this.subjects.push({
               ID: element.ID,
               Name: element.SubjectName_en,
               Videos: [],
               Scripts: [],
               ChartOptions: null
            });
         });
         this.loadSubjectWiseData();
   
      }, err => {
         this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      });
   }

   loadSubjectWiseData() {
      this.subjects.forEach(element => {
         element.ChartOptions = null;
         this.getLearnerVideoHistory(element);
         this.getLearnerVideoScriptHistory(element);
         this.getLearnerSmallTestHistory(element);
      });
   }

   GetLearnerDetaileById() {
      this._service.get('Learner/GetLearnerDetaileById/' + this.id).subscribe(res => {
         if (res.Status === ResponseStatus.WARNING) {
            this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
            return;
         }
         else if (res.Status === ResponseStatus.ERROR) {
            this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
            return;
         }
         this.Learner = res.Data;
         this.classId = res.Data.ClassID;
         this.getSubjects(res.Data.ClassID);
         this.getAllCount(res.Data.ClassID);
      }, err => {
         this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      }
      );
   }

   GetLearnerCallHistoryWithPagination() {
      this.loadingIndicator = true;

      const obj = {
         learnerId: this.id,
         pageNumber: this.page.pageNumber,
         pageSize: this.page.size,

      };

      this._service.get('Learner/GetLearnerCallHistoryWithPagination', obj).subscribe(res => {
         // if (!res.Success) {
         //   this.toastr.warning(res, 'Warning!', { closeButton: true, disableTimeOut: false });
         //   return;
         // }
         this.callHistory.list = res.Records;
         this.callHistory.total = res.Records.length;
         //this.page.totalElements = this.rows.length;
         //this.page.totalPages = this.page.totalElements / this.page.size;
         setTimeout(() => {
            this.loadingIndicator = false;
            this.tableComponent.recalculate();
         }, 1000);
      }, err => {
         this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
         setTimeout(() => {
            this.loadingIndicator = false;
         }, 1000);
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
         learnerId: this.id,
         subjectId: subject.ID
      }
      this._service.get('Learner/GetLearnerVideoHistory', obj).subscribe(res => {
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
         learnerId: this.id,
         subjectId: subject.ID
      }
      this._service.get('Learner/GetLearnerVideoScriptHistory', obj).subscribe(res => {
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
         learnerId: this.id,
         subjectId: subject.ID
      }
      this._service.get('Learner/GetLearnerSmallTestHistory', obj).subscribe(res => {
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

   getBigTestParticipationCountByLearner() {
      this._service.get('Learner/getBigTestParticipationCountByLearner/' + this.id).subscribe(res => {
         // if (!res.Success) {
         //    this.toastr.warning(res.Message, 'Warning!', { closeButton: true, disableTimeOut: false });
         //    return;
         // }
         this.exams.list = res;
      }, err => {
         this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      }
      );
   }

   GetBigTestCompleteByLearner() {
      this._service.get('Learner/GetBigTestCompleteByLearner/' + this.id).subscribe(res => {
         // if (!res.Success) {
         //    this.toastr.warning(res.Message, 'Warning!', { closeButton: true, disableTimeOut: false });
         //    return;
         // }
         this.examCompleted.list = res;
      }, err => {
         this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      }
      );
   }

   refreshComponent() {
      this.GetLearnerDetaileById();
      this.loadSubjectWiseData();
   }

   ShowDeviceDetails(deviceTemplate) {
      var deviceNo = this.Learner.DeviceNo
      //this.modalRef = this.modalService.show(deviceTemplate, this.modalConfig);
      this._service.get('Master/GetDeviceInfo/' + deviceNo).subscribe(res => {
         this.blockUI.stop();
         if (res.Status === ResponseStatus.WARNING) {
            this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
            return;
         }
         else if (res.Status === ResponseStatus.ERROR) {
            this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
            return;
         }
         this.DeviceDetail = res.Data;
         this.modalRef = this.modalService.show(deviceTemplate, this.modalConfig);
      }, err => {
         this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      }
      );

   }
   modalHide() {
      this.modalRef.hide();
   }
}
