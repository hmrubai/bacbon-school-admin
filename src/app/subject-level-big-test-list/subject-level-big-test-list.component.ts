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
  selector: 'app-subject-level-big-test-list',
  templateUrl: './subject-level-big-test-list.component.html',
  styleUrls: ['./subject-level-big-test-list.component.scss']
})
export class SubjectLevelBigTestListComponent implements OnInit {

  id: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;

  modalTitle = 'Add Audio';
  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  btnSaveText = 'Save';
  loadingIndicator = false;
  filterForm: FormGroup;

  page = new Page();
  rows = [];
  filteredData = [];

  classList: Array<any> = [];
  subjectList: Array<any> = [];
  levelList: Array<any> = [];
  testList: Array<any> = [];

  subjectListFilter: Array<any> = [];
  levelListFilter: Array<any> = [];

  modalLgConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  selectedSubject : any;
  selectedLevel : any;
  @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
  
  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    if (this.route.snapshot.queryParamMap.has("id")) {
      this.id = this.route.snapshot.queryParamMap.get("id");

    }
    this.page.pageNumber = 0;
    this.page.size = 20;
  }


  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      Level: [null],
      Class: [null],
      Subject: [null],

    });
    this.entryForm = this.formBuilder.group({
      Id: [null],
      Class: [null, [Validators.required]],
      Subject: [null, [Validators.required]],
      Level: [null, [Validators.required]],
      Test: [null, [Validators.required]],
      File: [null],
      FileSource: [null]
    });

    this.getClassList();
    this.getBigTestList();
    this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }
  getClassList() {
    this._service.get('Master/GetClassList').subscribe(res => {
      this.classList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'warning!', { closeButton: true, disableTimeOut: false });
    });
  }


  onChangeFilterClass(event) {
    this.subjectListFilter = [];
    if (!event) return;
    this.filterForm.controls['Subject'].setValue(null);
    this.filterForm.controls['Level'].setValue(null);
    this._service.get('Master/GetSubjectList/' + event.ID).subscribe(res => {
      this.subjectListFilter = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }
  onChangeClass(event) {
    this.subjectList = [];
    if (!event) return;
    this.entryForm.controls['Subject'].setValue(null);
    this.entryForm.controls['Level'].setValue(null);
    this._service.get('Master/GetSubjectList/' + event.ID).subscribe(res => {
      this.subjectList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  onChangeFilterSubject(event) {
    this.levelListFilter = [];
    if (!event) return;
    this.filterForm.controls['Level'].setValue(null);
    this._service.get('Master/GetLevelList/' + event.ID).subscribe(res => {
      this.levelListFilter = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  onChangeSubject(event) {
    this.levelList = [];
    if (!event) return;
    this.entryForm.controls['Level'].setValue(null);
    this._service.get('Master/GetLevelList/' + event.ID).subscribe(res => {
      this.levelList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }



  getBigTestList() {
    this._service.get('Master/GetBigTestList').subscribe(res => {
      this.testList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      classId: this.filterForm.value.Class ? this.filterForm.value.Class : 0,
      subjectId: this.filterForm.value.Subject ? this.filterForm.value.Subject : 0,
      chapterId: this.filterForm.value.Level ? this.filterForm.value.Level : 0,
    };
    this._service.get('Master/GetSubjectLevelBigTestList',obj).subscribe(res => {
      this.loadingIndicator = false;
      // if (!res.Success) {
      //   this.toastr.warning(res, 'Warning!', { closeButton: true, disableTimeOut: false });
      //   return;
      // }
      this.rows = res.Data;
      this.filteredData = this.rows;
      this.page.totalElements =this.rows?  this.rows.length : 0;
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
    this._service.get('Master/GetSubjectLevelBigTestById/' + id).subscribe(res => {
      this.blockUI.stop();
     
      this.modalTitle = 'Update Audio';
      this.btnSaveText = 'Update';
      this.entryForm.controls['Id'].setValue(res.Data.ID);
      this.entryForm.controls['Class'].setValue(res.Data.ClassID);
      this.entryForm.controls['Test'].setValue(res.Data.BigTestID);

      this.onChangeClass({ ID: res.Data.ClassID });
      this.onChangeSubject({ ID: res.Data.SubjectID });
   
      this.selectedSubject = res.Data.SubjectID;
      this.selectedLevel = res.Data.LevelID;

     
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

    this.blockUI.start('Saving...');

    const obj = {
      Id: this.entryForm.value.Id,
      ClassID: this.entryForm.value.Class,
      SubjectID: this.entryForm.value.Subject,
      LevelID: this.entryForm.value.Level,
      BigTestID: this.entryForm.value.Test,
    
    };

    const formData = new FormData();
    formData.append('totalobj', JSON.stringify(obj));
    if (this.entryForm.value.FileSource) formData.append('File', this.entryForm.value.FileSource);


    this._service.post('Master/SaveOrUpdateSubjectLevelBigTest', formData).subscribe(
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
        this.toastr.success(data.Message, 'CLASS SUBJECT CHAPTER BIGTEST', { timeOut: 2000 });
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
    this.filterForm.reset()
    this.modalRef.hide();
    this.subjectList = [];
    this.levelList = [];
    this.submitted = false;
    this.modalTitle = 'Add Audio';
    this.btnSaveText = 'Save';
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

  resetFilterList() {
    this.filterForm.reset();
    this.getList();
  }
}
