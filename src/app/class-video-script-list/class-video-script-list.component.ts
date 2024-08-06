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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';

@Component({
  selector: 'app-class-video-script-list',
  templateUrl: './class-video-script-list.component.html',
  styleUrls: ['./class-video-script-list.component.scss']
})
export class ClassVideoScriptListComponent implements OnInit {

  id: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;

  modalTitle = 'Add Script';
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
  videoList: Array<any> = [];
  scriptList: Array<any> = [];

  modalLgConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;
  @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
  
  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private confirmService: ConfirmService,
    private route: ActivatedRoute
  ) {
   
  }


  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      Class: [null],

    });
    this.entryForm = this.formBuilder.group({
      Id: [null],
      Class: [null, [Validators.required]],
      Video: [null, [Validators.required]],
      Script: [null, [Validators.required]],
      File: [null],
      FileSource: [null]
    });

    this.getClassList();
    this.getScriptList();
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

  onChangeClass(event) {
    this.videoList = [];
    if (!event) return;
   this.entryForm.controls['Video'].setValue(null);
    this._service.get('Master/GetVideoDropdownList/' + event.ID).subscribe(res => {
      this.videoList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  
  getScriptList() {
    this._service.get('Master/GetScriptList').subscribe(res => {
      this.scriptList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      // name: this.filterForm.value.Name ? this.filterForm.value.Name.trim() :null,
       classId: this.filterForm.value.Class ? this.filterForm.value.Class : 0,
      // video: this.filterForm.value.Video ? this.filterForm.value.Video : 0,
     };
    this._service.get('Master/GetVideoScriptList',obj).subscribe(res => {
      this.loadingIndicator = false;
      // if (!res.Success) {
      //   this.toastr.warning(res, 'Warning!', { closeButton: true, disableTimeOut: false });
      //   return;
      // }
      this.rows = res.Data;
      this.filteredData = this.rows;
      this.page.totalElements =  this.rows.length ;
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

  // getItem(id, template: TemplateRef<any>) {
  //   this.blockUI.start('Getting data...');
  //   this._service.get('Master/GetSubjectLevelVideoSmallTest/' + id).subscribe(res => {
  //     this.blockUI.stop();
  //     // if (!res.Success) {
  //     //   this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
  //     //   return;
  //     // }
  //     this.modalTitle = 'Update Audio';
  //     this.btnSaveText = 'Update';
  //     this.entryForm.controls['Id'].setValue(res.ID);
  //     this.entryForm.controls['Video'].setValue(res.SubjectLevelVideoID);
  //     this.entryForm.controls['Script'].setValue(res.ScriptID);
  //     this.openModal(template)
  //   }, err => {
  //     this.blockUI.stop();
  //     this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
  //   });
  // }
  DeleteItem(videoId,scriptId) {
    const obj={
      videoID : videoId,
      scriptID : scriptId,
    }
    this.confirmService.confirm('Are you sure?', 'You are going to remove the script under this video.')
       .subscribe(
          result => {
             if (result) {

                this.blockUI.start('Removing...');
                this._service.get('Master/DeleteVideoScriptById',obj ).subscribe(res => {
                   this.blockUI.stop();
                   if (res.Status === 2) {
                    this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
                    return;
                  }
                  else if (res.Status === 1) {
                    this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                    return;
                  }
                   this.toastr.success(res.Message, 'Error!', { timeOut: 2000 });
                   this.getList();

                }, err => { this.blockUI.stop(); });
             }
          },

       );
 }

  onFormSubmit() {
    this.submitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    const obj = {
      Id: this.entryForm.value.Id,
      ClassID: this.entryForm.value.Class,
      VideoID: this.entryForm.value.Video,
      ScriptID: this.entryForm.value.Script,

    };

    const formData = new FormData();
    formData.append('totalobj', JSON.stringify(obj));
    if (this.entryForm.value.FileSource) formData.append('File', this.entryForm.value.FileSource);

    this.blockUI.start('Saving data. Please wait...');
    this._service.post('Master/SaveOrUpdateVideoScript', formData).subscribe(
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
        this.toastr.success(data.Message, ' CLASS VIDEO SMALL TEST', { timeOut: 2000 });
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
    this.videoList=[];
    this.submitted = false;
    this.modalTitle = 'Add Script';
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

  resetFilterList() {
    this.filterForm.reset();
    this.getList();
  }
}
