import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { Page } from '../_models/page';


@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  encapsulation: ViewEncapsulation.None
})

export class SchoolComponent implements OnInit {

  entryForm: FormGroup;
  filterForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  formTitle = 'Add School';
  modalTitle = 'Add School';
  btnSaveText = 'Save';

  modalLgConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  mainCategoryList: Array<any> = [];

  page = new Page();
  emptyGuid = 0;
  rows = [];
  loadingIndicator = false;
  ColumnMode = ColumnMode;
  AreaList: Array<any> = [];
  scrollBarHorizontal = (window.innerWidth < 1200);
  @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
  constructor(
    private modalService: BsModalService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    window.onresize = () => {
      this.scrollBarHorizontal = (window.innerWidth < 1200);
    };
  }

  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      Id: [null],
      Bangla: [null, [Validators.required, Validators.maxLength(250)]],
      English: [null, [Validators.required, Validators.maxLength(250)]],
      Address: [null, [ Validators.maxLength(250)]],
      Area: [null, [Validators.required]],
     
    });
    this.filterForm = this.formBuilder.group({
      Area: [null],
    });
    this.getList();
    this.getAreaList();
  }
  getAreaList() {
    this._service.get('Master/GetAreaList').subscribe(res => {
      this.AreaList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  
  get f() {
    return this.entryForm.controls;
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      areaId: this.filterForm.value.Area,
      // size: this.page.size,
      // pageNumber: this.page.pageNumber
    };
    this._service.get('Master/GetSchoolList', obj).subscribe(res => {
      this.loadingIndicator = false;
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.rows = res.Data;
      
      this.page.totalElements = this.rows.length;
      this.page.totalPages = this.page.totalElements / this.page.size;
      setTimeout(() => {
        this.loadingIndicator = false;
        this.tableComponent.recalculate();
      }, 1000);
    }, err => {
      this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    }
    );
  }
  filterList() {
    this.page.pageNumber=0
   this.getList()
  }

  getItem(id, template: TemplateRef<any>) {
    this.blockUI.start('Getting data...');
    this._service.get('Master/GetSchoolById/' + id).subscribe(res => {
      this.blockUI.stop();
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.formTitle = 'Update School';
      this.modalTitle = 'Update School';
      this.btnSaveText = 'Update';
      this.entryForm.controls['Id'].setValue(res.Data.ID);
      this.entryForm.controls['Area'].setValue(res.Data.AreaID);
      this.entryForm.controls['English'].setValue(res.Data.Name_en);
      this.entryForm.controls['Bangla'].setValue(res.Data.Name_en);
      this.entryForm.controls['Address'].setValue(res.Data.Address);
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
      Name_bn: this.entryForm.value.Bangla,
      Name_en: this.entryForm.value.English,
      Address: this.entryForm.value.Address,

      AreaId: this.entryForm.value.Area,
     
    };

    const request = this._service.post('Master/SaveOrUpdateSchool', obj);

    request.subscribe(
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
        this.toastr.success(data.Message, 'SCHOOL', { timeOut: 2000 });
        this.modalHide()
        this.getList();
      },
      err => {
        this.blockUI.stop();
        this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      }
    );

  }

  clearForm() {
    this.entryForm.reset();
    this.submitted = false;
    this.formTitle = 'Add School';
    this.btnSaveText = 'Save';
  
  }

  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Add School';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }
  resetFilterList() {
    this.filterForm.reset();
    this.getList();
  }
}
