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
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit {

  id: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;

  modalTitle = 'Add Video';
  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  btnSaveText = 'Save';
  loadingIndicator = false;
  filterForm: FormGroup;

  page = new Page();
  rows = [];
  filteredData = [];

  subjectListFilter: Array<any> = [];
  subjectList: Array<any> = [];
  levelList: Array<any> = [];
  classList: Array<any> = [];

  modalLgConfig: any = { class: 'gray modal-xl', backdrop: 'static' };
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
    this.page.size = 20;
  }


  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      Name: [null],
      Class: [null],
      Subject: [null],

    });
    this.entryForm = this.formBuilder.group({
      Id: [null],
      Class: [null, [Validators.required]],
      Subject: [null, [Validators.required]],
      Level: [null, [Validators.required]],
      English: [null, [Validators.required,Validators.maxLength(250)]],
      Bangla: [null, [Validators.required,Validators.maxLength(250)]],
      Video: [null,],
      VideoSource: [null],
      Thumbnail: [null,],
      ThumbnailSource: [null],
      Length: [null,[Validators.required]],
      IsSdCard: [false],
    });
    this.getClassList();

    this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.limit;
  }
  onChangeFilterClass(event) {
    this.subjectListFilter = [];
    if (!event) return;
    this.filterForm.controls['Subject'].setValue(null);
    this._service.get('Master/GetSubjectList/' + event.ID).subscribe(res => {
      this.subjectListFilter = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  onChangeClass(event) {
    this.subjectList = [];
    this.levelList = [];
    if (!event) return;
    this.entryForm.controls['Subject'].setValue(null);
    this.entryForm.controls['Level'].setValue(null);
    this.loadSubjectList(event.ID);
  }

  private loadSubjectList(classId) {
    this._service.get('Master/GetSubjectList/' + classId).subscribe(res => {
      this.subjectList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  onChangeSubject(event) {
    this.levelList = [];
    if (!event) return;
    this.entryForm.controls['Level'].setValue(null);
    this.loadLevelList(event.ID);
  }

  private loadLevelList(subjectID) {
    this._service.get('Master/GetLevelList/' + subjectID).subscribe(res => {
      this.levelList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  getClassList() {
    this._service.get('Master/GetClassList').subscribe(res => {
      this.classList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  

  getList() {
    this.loadingIndicator = true;
    const obj = {
      name: this.filterForm.value.Name ? this.filterForm.value.Name.trim() :null,
      classId: this.filterForm.value.Class ? this.filterForm.value.Class : 0,
      subjectId: this.filterForm.value.Subject ? this.filterForm.value.Subject : 0,
    };
    this._service.get('Master/GetSubjectLevelVideoList',obj).subscribe(res => {
      this.loadingIndicator = false;
      // if (!res.Success) {
      //   this.toastr.warning(res, 'Warning!', { closeButton: true, disableTimeOut: false });
      //   return;
      // }
      this.rows = res.Data;
      this.filteredData = this.rows;
     // this.page.totalElements = this.rows.length;
     // this.page.totalPages = this.page.totalElements / this.page.size;
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
    this._service.get('Master/GetSubjectLevelVideoById/' + id).subscribe(res => {
      this.blockUI.stop();
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.modalTitle = 'Update Video';
      this.btnSaveText = 'Update';
      this.entryForm.controls['Id'].setValue(res.Data.ID);
      this.entryForm.controls['Class'].setValue(res.Data.ClassID);
      this.entryForm.controls['Subject'].setValue(res.Data.SubjectID);
      this.entryForm.controls['Level'].setValue(res.Data.LevelID);
      this.entryForm.controls['Bangla'].setValue(res.Data.VideoTitle_bn);
      this.entryForm.controls['English'].setValue(res.Data.VideoTitle_en);
      this.entryForm.controls['Length'].setValue(res.Data.VideoLength);
      this.entryForm.controls['IsSdCard'].setValue(res.Data.IsSDCard);

      this.loadSubjectList(res.Data.ClassID);
      this.loadLevelList(res.Data.SubjectID);

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
      ID: this.entryForm.value.Id,
      ClassID: this.entryForm.value.Class,
      SubjectID: this.entryForm.value.Subject,
      LevelID: this.entryForm.value.Level,
      VideoTitle_bn: this.entryForm.value.Bangla,
      VideoTitle_en: this.entryForm.value.English,
      VideoLength: this.entryForm.value.Length,
      IsSDCard: this.entryForm.value.IsSdCard
    };

    const formData = new FormData();
    formData.append('totalObj', JSON.stringify(obj));
    if (this.entryForm.value.fileSource) formData.append('File', this.entryForm.value.fileSource);


    this._service.post('Master/SaveOrUpdateSubjectLevelVideo', formData).subscribe(
      res => {
        this.blockUI.stop();
        if (res.Status === 2) {
          this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
          return;
        }
        else if (res.Status === 1) {
          this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
          return;
        }
        this.toastr.success(res.Message, 'VIDEOS', { timeOut: 2000 });
        this.modalHide()
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
    this.modalTitle = 'Add Video';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    this.entryForm.controls['IsSdCard'].setValue(false);
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }

  onVideoFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.entryForm.patchValue({
        fileSource: file
      });
    }
  }

  onThumbnailFileChange(event) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.entryForm.patchValue({
        ThumbnailSource: file
      });
    }
  }

  filterDatatable(event) {

    const val = event.target.value.toLowerCase();
    if (val) {
      // filter our data
      const temp = this.filteredData.filter(function (d) {
        return d.VideoTitle_bn.toLowerCase().indexOf(val) !== -1 ||
          d.VideoTitle_en.toLowerCase().indexOf(val) !== -1 ||
          //d.ClassName.toLowerCase().indexOf(val) !== -1 ||
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
