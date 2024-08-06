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

@Component({
  selector: 'app-small-test-list',
  templateUrl: './small-test-list.component.html',
  styleUrls: ['./small-test-list.component.scss']
})
export class SmallTestListComponent implements OnInit {

  id: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;

  modalTitle = 'Add Small Test';
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
      Bangla: [null, [Validators.required,Validators.maxLength(250)]],
      English: [null, [Validators.required,Validators.maxLength(250)]],

    });
    this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
  }


  getList() {
    this.loadingIndicator = true;

    this._service.get('Master/GetSmallTestList').subscribe(res => {
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
    this._service.get('Master/GetSmallTestById/' + id).subscribe(res => {
      this.blockUI.stop();
      // if (!res.Success) {
      //   this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
      //   return;
      // }
      this.modalTitle = 'Update Small Test';
      this.btnSaveText = 'Update';
      this.entryForm.controls['Id'].setValue(res.Data.ID);
      this.entryForm.controls['Bangla'].setValue(res.Data.SmallTestName_bn);
      this.entryForm.controls['English'].setValue(res.Data.SmallTestName_en);

      this.openModal(template)
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
      SmallTestName_bn: this.entryForm.value.Bangla,
      SmallTestName_en: this.entryForm.value.English,

    };

    this._service.post('Master/SaveOrUpdateSmallTest', obj).subscribe(
      
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
        this.toastr.success(data.Message, 'SMALL TEST', { timeOut: 2000 });
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
    this.modalTitle = 'Add Small Test';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }


  filterDatatable(event) {

    const val = event.target.value.toLowerCase();
    if (val) {
      // filter our data
      const temp = this.filteredData.filter(function (d) {
        return d.SmallTestName_bn.toLowerCase().indexOf(val) !== -1 ||
          d.SmallTestName_en.toLowerCase().indexOf(val) !== -1 ||
          !val;
      });
      this.rows = temp;
    }

    if (!val) this.rows = this.filteredData;

    this.page.pageNumber = 0;
    this.page.totalElements = this.rows.length;
    this.page.totalPages = this.page.totalElements / this.page.size;
  }
}
