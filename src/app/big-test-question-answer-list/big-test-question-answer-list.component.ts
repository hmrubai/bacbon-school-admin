import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Page } from '../_models/page';
import { CommonService } from '../_services/common.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-big-test-question-answer-list',
  templateUrl: './big-test-question-answer-list.component.html',
  styleUrls: ['./big-test-question-answer-list.component.scss']
})
export class BigTestQuestionAnswerListComponent implements OnInit {

  id: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;

  modalTitle = 'Add Big Test QA';
  entryForm: FormGroup;
  uploadForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  btnSaveText = 'Save';
  loadingIndicator = false;
  filterForm: FormGroup;

  page = new Page();
  rows = [];
  filteredData = [];

  testList: Array<any> = [];

  modalLgConfig: any = { class: 'gray modal-xl', backdrop: 'static' };
  modalRef: BsModalRef;

  qsnTypeList = [{ ID: 1, Name: "mcq" }, { ID: 1, Name: "gap" }]
  @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
  selectedTest: any;
  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {


    this.page.pageNumber = 0;
    this.page.size = 10;
  }


  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      Name: [null],
      Test: [null],

    });
    this.entryForm = this.formBuilder.group({
      Id: [null],
      Test: [null, [Validators.required]],
      English: [null, [Validators.required]],
      Bangla: [null, [Validators.required]],
      Option1: [null],
      Option2: [null],
      Option3: [null],
      Option4: [null],
      Correct: [null],
      Type: [null],
      File: [null,],
      FileSource: [null],

    });
    this.uploadForm = this.formBuilder.group({
      Test: [null, [Validators.required]],
      File: [null],
      FileSource: [null],
    });

    this.getTestList();

    this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }

  get uf() {
    return this.uploadForm.controls;
  }

  getTestList() {
    this._service.get('Master/GetBigTestList').subscribe(res => {
      this.testList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'warning!', { closeButton: true, disableTimeOut: false });
    });
  }


  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      name: this.filterForm.value.Name ? this.filterForm.value.Name.trim() :null,
      testId: this.filterForm.value.Test ? this.filterForm.value.Test : 0,
     
    };
    this._service.get('Master/GetBigTestQuestionAnswerList',obj).subscribe(res => {
      this.loadingIndicator = false;
      // if (!res.Success) {
      //   this.toastr.warning(res, 'Warning!', { closeButton: true, disableTimeOut: false });
      //   return;
      // }
      this.rows = res.Data;
      this.filteredData = this.rows;
      this.page.totalElements = this.rows.length;
      this.page.totalPages = this.page.totalElements / this.page.size;
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

  getItem(id, template: TemplateRef<any>) {
    this.blockUI.start('Getting data...');
    this._service.get('Master/GetBigTestQuestionAnswerById/' + id).subscribe(res => {
      this.blockUI.stop();

      this.modalTitle = 'Update Small Test QA';
      this.btnSaveText = 'Update';
      this.entryForm.controls['Id'].setValue(res.Data.Id);
      this.selectedTest = res.Data.BigTestID;
      this.entryForm.controls['Bangla'].setValue(res.Data.Question_bn);
      this.entryForm.controls['English'].setValue(res.Data.Question_en);
      this.entryForm.controls['Option1'].setValue(res.Data.Answer1);
      this.entryForm.controls['Option2'].setValue(res.Data.Answer2);
      this.entryForm.controls['Option3'].setValue(res.Data.Answer3);
      this.entryForm.controls['Option4'].setValue(res.Data.Answer4);
      this.entryForm.controls['Correct'].setValue(res.Data.CorrectAnswer1);
      this.entryForm.controls['Type'].setValue(res.Data.QuestionType);
      this.modalRef = this.modalService.show(template, this.modalLgConfig);
    }, err => {
      this.blockUI.stop();
      this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    this.blockUI.start('Saving data. Please wait...');
    const obj = {
      Id: this.entryForm.value.Id,
      BigTestID: this.entryForm.value.Test,
      Question_en: this.entryForm.value.English,
      Question_bn: this.entryForm.value.Bangla,
      Answer1: this.entryForm.value.Option1,
      Answer2: this.entryForm.value.Option2,
      Answer3: this.entryForm.value.Option3,
      Answer4: this.entryForm.value.Option4,
      CorrectAnswer1: this.entryForm.value.Correct,
      QuestionType: this.entryForm.value.Type
    };

    const formData = new FormData();
    formData.append('totalobj', JSON.stringify(obj));
    if (this.entryForm.value.fileSource) formData.append('File', this.entryForm.value.fileSource);


    this._service.post('Master/SaveOrUpdateBigTestQuestionAnswer', formData).subscribe(
      data => {
        this.blockUI.stop();
        if (data.Status !== 0) {
          this.toastr.warning(data.Message, 'Warning!', { closeButton: true, disableTimeOut: false });
          return;
        }
        this.toastr.success(data.Message, 'BIG TEST QA', { timeOut: 2000 });
        this.modalHide();
        this.getList();

      },
      err => {
        this.blockUI.stop();
        this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      }
    );

  }


  onBulkUploadFormSubmit() {
    this.submitted = true;
    if (this.uploadForm.invalid) {
      return;
    }

    if (!this.uploadForm.value.FileSource) {
      this.toastr.warning('Choose an excel file', 'Warning!', { closeButton: true, disableTimeOut: false });
      return;
    }

    this.blockUI.start('Saving data. Please wait...');

    const formData = new FormData();
    formData.append('File', this.uploadForm.value.FileSource);


    this._service.post('Master/UploadBigTestQuestionAnswer/' + this.uploadForm.value.Test, formData).subscribe(
      data => {
        this.blockUI.stop();
        if (data.Status !== 0) {
          this.toastr.warning(data.Message, 'Warning!', { closeButton: true, disableTimeOut: false });
          return;
        }
        this.toastr.success(data.Message, 'BIG TEST QA', { timeOut: 2000 });
        this.modalHide();
        this.getList();

      },
      err => {
        this.blockUI.stop();
        this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      }
    );

  }



  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Add Big Test QA';
    this.btnSaveText = 'Save';
  }


  modalBulkUploadHide() {
    this.uploadForm.reset();
    this.modalRef.hide();
    this.submitted = false;
  }

  openBulkUploadModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'gray modal-md', backdrop: 'static' });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }

  onFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.entryForm.patchValue({
        fileSource: file
      });
    }
  }

  onUploadFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.patchValue({
        FileSource: file
      });
    }
  }

  filterDatatable(event) {

    const val = event.target.value.toLowerCase();
    if (val) {
      // filter our data
      const temp = this.filteredData.filter(function (d) {
        return d.BigTestEnName.toLowerCase().indexOf(val) !== -1 ||
          d.Question_en.toLowerCase().indexOf(val) !== -1 ||
          d.Question_bn.toLowerCase().indexOf(val) !== -1 ||
          !val;
      });
      this.rows = temp;
    }

    if (!val) this.rows = this.filteredData;

    this.page.pageNumber = 0;
    this.page.totalElements = this.rows.length;
    this.page.totalPages = this.page.totalElements / this.page.size;
  }
  resetFilterList() {
    this.filterForm.reset();
    this.getList();
  }
}
