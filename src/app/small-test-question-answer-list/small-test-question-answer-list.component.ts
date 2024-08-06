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
import { UploadDialogComponent } from '../_helpers/upload-dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-small-test-question-answer-list',
  templateUrl: './small-test-question-answer-list.component.html',
  styleUrls: ['./small-test-question-answer-list.component.scss']
})
export class SmallTestQuestionAnswerListComponent implements OnInit {

  id: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;

  modalTitle = 'Add Small Test QA';
  entryForm: FormGroup;
  qaForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  btnSaveText = 'Save';
  loadingIndicator = false;
  filterForm: FormGroup;

  page = new Page();
  rows = [];
  filteredData = [];

  testList: Array<any> = [];
  qsnTypeList = [{ ID: 1, Name: "mcq" }, { ID: 1, Name: "gap" }]

  modalLgConfig: any = { class: 'gray modal-xl', backdrop: 'static' };
  modalRef: BsModalRef;

  modalMdConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRefQA: BsModalRef;
  @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
  selectedTest: any;
  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
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

    this.qaForm = this.formBuilder.group({
      Test: [null, [Validators.required]],
      File: [null,],
      FileSource: [null],

    });

    this.getTestList();
    this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }

  get q() {
    return this.qaForm.controls;
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
  }

  getTestList() {
    this._service.get('Master/GetSmallTestList').subscribe(res => {
      this.testList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'warning!', { closeButton: true, disableTimeOut: false });
    });
  }



  getList() {
    this.loadingIndicator = true;

    const obj = {
      name: this.filterForm.value.Name ? this.filterForm.value.Name.trim() :null,
      testId: this.filterForm.value.Test ? this.filterForm.value.Test : 0,
     
    };
    this._service.get('Master/GetSmallTestQuestionAnswerList',obj).subscribe(res => {
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
    this._service.get('Master/GetSmallTestQuestionAnswerById/' + id).subscribe(res => {
      this.blockUI.stop();

      this.modalTitle = 'Update Small Test QA';
      this.btnSaveText = 'Update';
      this.entryForm.controls['Id'].setValue(res.Data.ID);
      this.selectedTest = res.Data.SmallTestID;
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
      SmallTestID: this.entryForm.value.Test,
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
    if (this.entryForm.value.FileSource) formData.append('File', this.entryForm.value.FileSource);


    this._service.post('Master/SaveOrUpdateSmallTestQuestionAnswer', formData).subscribe(
      data => {
        this.blockUI.stop();
        if (data.Status === 2) {
          this.toastr.warning(data.Message, 'Warning!', { timeOut: 2000 });
          return;
        }
        else if (data.Status === 1) {
          this.toastr.error(data.Message, 'Error!', { timeOut: 2000 });
          return;
        }
        this.toastr.success(data.Message, 'SMALL TEST QA', { timeOut: 2000 });
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
    this.filterForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Add Small Test QA';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }

  onFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.entryForm.patchValue({
        FileSource: file
      });
    }
  }

  filterDatatable(event) {

    const val = event.target.value.toLowerCase();
    if (val) {
      // filter our data
      const temp = this.filteredData.filter(function (d) {
        return d.SmallTestEnName.toLowerCase().indexOf(val) !== -1 ||
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

  public openUploadDialog() {
    let dialogRef = this.dialog.open(UploadDialogComponent, { data: { url: this._service.generateUrl('employee/upload'), whiteList: ['xlsx', 'xls'], uploadtext: 'Please upload an Excel file', title: 'Upload Small Test QA File' }, width: '50%', height: '50%' })
      .afterClosed()
      .subscribe(response => {
        if (response) {
          this.toastr.success(response, 'Success!', { timeOut: 2000 });
          this.getList();
        }
      });
  }
  openBulkUploadModal(template: TemplateRef<any>) {
    this.modalRefQA = this.modalService.show(template, this.modalMdConfig);
  }

  modalHideQA() {
    this.qaForm.reset();
    this.modalRefQA.hide();
    this.submitted = false;
  }

  onQAFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.qaForm.patchValue({
        FileSource: file
      });
    }
  }

  uploadQA(){
 this.submitted = true;
    if (this.qaForm.invalid) {
      return;
    }
    const formData = new FormData();
    if (this.qaForm.value.FileSource) formData.append('File', this.qaForm.value.FileSource);

    this.blockUI.start('Saving data. Please wait...');

    this._service.post('Master/UploadSmallTestQuestionAnswer/'+this.qaForm.value.Test, formData).subscribe(
      data => {
        this.blockUI.stop();
        if (data.Status === 2) {
          this.toastr.warning(data.Message, 'Warning!', { timeOut: 2000 });
          return;
        }
        else if (data.Status === 1) {
          this.toastr.error(data.Message, 'Error!', { timeOut: 2000 });
          return;
        }
        this.toastr.success(data.Message, 'SMALL TEST QA', { timeOut: 2000 });
        this.modalHideQA();
        this.getList();

      },
      err => {
        this.blockUI.stop();
        this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      }
    );

  }
  resetFilterList() {
    this.filterForm.reset();
    this.getList();
  }
}
