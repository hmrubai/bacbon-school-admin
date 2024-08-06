import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Page } from '../_models/page';
import { CommonService } from '../_services/common.service';
import { debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-tutor-call-list-details',
  templateUrl: './tutor-call-list-details.component.html',
  styleUrls: ['./tutor-call-list-details.component.scss']
})
export class TutorCallListDetailComponent implements OnInit {

  id: string;
  phone: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;

  modalTitle = 'Add Video';
  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  btnSaveText = 'Save';
  loadingIndicator = false;
  filterForm: FormGroup;
  maxDate: Date;

  page = new Page();
  rows = [];
  TotalCount: any;

  subjectList: Array<any> = [];
  levelList: Array<any> = [];

  modalLgConfig: any = { class: 'gray modal-xl', backdrop: 'static' };
  modalRef: BsModalRef;
  bsConfig: Partial<BsDaterangepickerConfig>;
  
  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {

 
    if (this.route.snapshot.paramMap.has("phone")) {
      this.phone = this.route.snapshot.paramMap.get("phone");
    }
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());
    this.page.pageNumber = 0;
    this.page.size = 20;
  }


  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      date: [[null, null],],
    });
    this.bsConfig = Object.assign({}, {
      isAnimated: true,
      adaptivePosition: true,
      rangeInputFormat: 'DD MMM YYYY'
  });
    this.getList();
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      phoneNumber: this.phone,
      fromDate: moment(this.filterForm.value.date[0]).format('DD-MMM-YYYY') ?? null,
      toDate: moment(this.filterForm.value.date[1]).format('DD-MMM-YYYY') ?? null,

    };
    this._service.get('Learner/GetLearnerCallHistoryDetails', obj).subscribe(res => {
      this.loadingIndicator = false;
      // if (!res.Success) {
      //   this.toastr.warning(res, 'Warning!', { closeButton: true, disableTimeOut: false });
      //   return;
      // }
      this.rows = res.Records;
      this.TotalCount = res.Total;
      this.page.totalElements = this.rows.length;
      this.page.totalPages = this.page.totalElements / this.page.size;
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }, err => {
      this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    });
  }

  downloadSample() {
    const obj = {
      phoneNumber: this.phone,
      fromDate: moment(this.filterForm.value.date[0]).format('DD-MMM-YYYY') ?? null,
      toDate: moment(this.filterForm.value.date[1]).format('DD-MMM-YYYY') ?? null,

    };
    return this._service.downloadFile('Learner/GetLearnerCallHistoryDetailsExcel',obj).subscribe(res => {
      const url = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = url;
      link.download = "learner-call-history.xlsx";
      link.click();
  
    },
      error => {
        this.toastr.warning(error.message || error, 'Error!', { timeOut: 2000, closeButton: true, disableTimeOut: false, enableHtml: true });
      });
  }
  
 

}
