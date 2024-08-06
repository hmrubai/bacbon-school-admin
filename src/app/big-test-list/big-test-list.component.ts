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
  selector: 'app-big-test-list',
  templateUrl: './big-test-list.component.html',
  styleUrls: ['./big-test-list.component.scss']
})
export class BigTestListComponent implements OnInit {

  id: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;

  modalTitle = 'Add Big Test';
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

  modalLgConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;

  @ViewChild('dataTable') table: any;
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
      Bangla: [null, [Validators.required]],
      English: [null, [Validators.required]],

    });


    // this.filterForm.get("name").valueChanges.pipe(debounceTime(700)).subscribe(() => {
    //   this.getList();
    // })
    this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }



  // setPage(pageInfo) {
  //   this.page.pageNumber = pageInfo.offset;
  //   this.getList();
  // }

  getList() {
    this.loadingIndicator = true;

    this._service.get('Master/GetBigTestList').subscribe(res => {
      this.loadingIndicator = false;
      // if (!res.Success) {
      //   this.toastr.warning(res, 'Warning!', { closeButton: true, disableTimeOut: false });
      //   return;
      // }
      this.rows = res.Data;
      this.filteredData= this.rows;
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
    this._service.get('Master/GetBigTestById/' + id).subscribe(res => {
      this.blockUI.stop();
      // if (!res.Success) {
      //   this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
      //   return;
      // }
      this.modalTitle = 'Update Big Test';
      this.btnSaveText = 'Update';
      this.entryForm.controls['Id'].setValue(res.Data.ID);
      this.entryForm.controls['Bangla'].setValue(res.Data.BigTestName_bn);
      this.entryForm.controls['English'].setValue(res.Data.BigTestName_en);
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

  
    const obj = {
      Id: this.entryForm.value.Id,
      BigTestName_bn: this.entryForm.value.Bangla,
      BigTestName_en: this.entryForm.value.English,

    };


    this.blockUI.start('Saving data. Please wait...');
    this._service.post('Master/SaveOrUpdateBigTest', obj).subscribe(
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
        this.toastr.success(data.Message, 'BIG TEST', { timeOut: 2000 });
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
    this.modalTitle = 'Add Big Test';
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
      if(val){
      // filter our data
      const temp = this.filteredData.filter(function (d) {
        return d.BigTestName_bn.toLowerCase().indexOf(val) !== -1 || !val;
      });
      this.rows = temp;
    }
   
    if (!val) this.rows = this.filteredData;

    this.page.pageNumber = 0;
    this.page.totalElements = this.rows.length;
    this.page.totalPages = this.page.totalElements / this.page.size;
  }
}
