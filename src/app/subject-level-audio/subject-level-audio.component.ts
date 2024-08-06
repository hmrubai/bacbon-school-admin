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
  selector: 'app-subject-level-audio',
  templateUrl: './subject-level-audio.component.html',
  styleUrls: ['./subject-level-audio.component.scss']
})
export class SubjectLevelAudioComponent implements OnInit {

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

  subjectList: Array<any> = [];
  levelList: Array<any> = [];
  classList: Array<any> = [];

  modalLgConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;
  @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
  
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
      name: [null],

    });
    this.entryForm = this.formBuilder.group({
      Id: [null],
      Class: [null, [Validators.required]],
      Subject: [null, [Validators.required]],
      Level: [null, [Validators.required]],
      File: [null, [Validators.required]],
      FileSource: [null]
    });

    this.getLevelList();
   // this.getClassList();
    this.getSubjectList();

    this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }

  getSubjectList() {
    this._service.get('Master/GetSubjectList').subscribe(res => {
      this.subjectList = res;
    }, err => {
      this.toastr.warning(err.message || err, 'warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  getLevelList() {
    this._service.get('Master/GetLevelList').subscribe(res => {
      this.levelList = res;
    }, err => {
      this.toastr.warning(err.message || err, 'warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  getClassList() {
    this._service.get('Master/GetclassLevelList').subscribe(res => {
      this.classList = res;
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

    this._service.get('Master/GetSubjectLevelList').subscribe(res => {
      this.loadingIndicator = false;
      // if (!res.Success) {
      //   this.toastr.warning(res, 'Warning!', { closeButton: true, disableTimeOut: false });
      //   return;
      // }
      this.rows = res;
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
    this._service.get('Master/GetSubjectLevelById/' + id).subscribe(res => {
      this.blockUI.stop();
      // if (!res.Success) {
      //   this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
      //   return;
      // }
      this.modalTitle = 'Update Audio';
      this.btnSaveText = 'Update';
      this.entryForm.controls['Id'].setValue(res.ID);
      this.entryForm.controls['Subject'].setValue(res.SubjectID);
      this.entryForm.controls['Level'].setValue(res.LevelId);

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
      Class: this.entryForm.value.Class,
      Subject: this.entryForm.value.Subject,
      Level: this.entryForm.value.Level,
      File: [null],
      FileSource: [null]
    };

    const formData = new FormData();
    formData.append('Model', JSON.stringify(obj));
    if (this.entryForm.value.fileSource) formData.append('File', this.entryForm.value.fileSource);

    this.blockUI.start('Saving data. Please wait...');
    this._service.post('Master/SaveOrUpdateSubjectLevelAudio', formData).subscribe(
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
        this.toastr.success(data.Message, 'Subject Chapter Audio', { timeOut: 2000 });
        this.entryForm.reset();

        this.getList();
        this.submitted = false;
      },
      err => {
        this.blockUI.stop();
        this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      }
    );

  }

  clearForm() {
    this.entryForm.reset();
    this.submitted = false;
    this.modalTitle = 'Add Audio';
    this.btnSaveText = 'Save';
  }


  modalHide() {
    this.entryForm.reset();
    this.filterForm.reset();
    this.modalRef.hide();
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

  filterDatatable(event) {

    const val = event.target.value.toLowerCase();
    if (val) {
      // filter our data
      const temp = this.filteredData.filter(function (d) {
        return  d.SubjectName.toLowerCase().indexOf(val) !== -1 ||
          d.LevelName.toLowerCase().indexOf(val) !== -1 ||
          //d.ClassName.toLowerCase().indexOf(val) !== -1 ||
          ! val;
      });
      this.rows = temp;
    }

    if (!val) this.rows = this.filteredData;

    this.page.pageNumber = 0;
    this.page.totalElements = this.rows.length;
    this.page.totalPages = this.page.totalElements / this.page.size;
  }
}
