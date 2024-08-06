import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from '../../environments/environment';
import { Page } from '../_models/page';
//import { Page } from '../_models/page';


@Component({
  selector: 'app-configuration',
  templateUrl: './test-participation.component.html',
  styleUrls: ['./test-participation.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TestParticipationComponent implements OnInit {

  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  modalTitle = 'Create Configuration';
  btnSaveText = 'Save';
  limit: Number = 5;

  isCollapsed: boolean = false;

  modalConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  baseUrl;
  logoURL: any;
  signatureURL: any;
  public message: string;

  TestList = { list: [], total: 0 };
  // page = new Page();

  rows = [];
  roleTypes: Array<any> = [{ id: 'Anonymous', text: 'Anonymous' }, { id: 'Restricted', text: 'Restricted' }];
  loadingIndicator = false;
  ColumnMode = ColumnMode;

  scrollBarHorizontal = (window.innerWidth < 1200);
  page = new Page();

  classes = [];
  Tests = [];

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
    this.page.pageNumber = 0;
    this.page.size = 5;
  }


  ngOnInit() {
    this.getClassWiseSubjects();
   // this.getSmallTestParticipationCount();
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
      this.loadSubjectWiseVideoCharts();
    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  loadSubjectWiseVideoCharts() {
    this.classes.forEach(academicClass => {
      academicClass.Test=null
      this.getSmallTestParticipationCount(academicClass);
      // academicClass.Subjects.forEach(element => {
      //   element.ChartOptions = null;
      //   this.getLearnerVideoHistory(element);
      // });
    });
  }

  getSmallTestParticipationCount(item: any) {
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber,
      classId: item.ID,
      subjectId: null

    };
    this._service.get('Learner/GetSmallTestParticipationCount', obj).subscribe(res => {
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      item.Test=res.Data
      
      //this.TestList.total = res.Total;
    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    }
    );
  }

  downloadSample(id) {
    return this._service.downloadFile('Learner/GetSmallTestParticipationCountExcel/' + id).subscribe(res => {
      const url = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = url;
      link.download = "small-test-participations.xlsx";
      link.click();

    },
      error => {
        this.toastr.warning(error.message || error, 'Error!', { timeOut: 2000, closeButton: true, disableTimeOut: false, enableHtml: true });
      });
  }


}
