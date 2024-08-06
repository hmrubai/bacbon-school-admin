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
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  id: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;

  modalTitle = 'Add Area';
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

    this._service.get('Master/GetAreaList').subscribe(res => {
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
    this._service.get('Master/GetAreaById/' + id).subscribe(res => {
      this.blockUI.stop();
      // if (!res.Success) {
      //   this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
      //   return;
      // }
      this.modalTitle = 'Update Area';
      this.btnSaveText = 'Update';
      this.entryForm.controls['Id'].setValue(res.Data.ID);
      this.entryForm.controls['Bangla'].setValue(res.Data.Name_bn);
      this.entryForm.controls['English'].setValue(res.Data.Name_en);

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
      Name_bn: this.entryForm.value.Bangla,
      Name_en: this.entryForm.value.English,

    };

    this._service.post('Master/SaveOrUpdateArea', obj).subscribe(
      
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
        this.toastr.success(data.Message, 'AREA', { timeOut: 2000 });
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
    this.modalTitle = 'Add Area';
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
        return d.Name_bn.toLowerCase().indexOf(val) !== -1 ||
          d.Name_en.toLowerCase().indexOf(val) !== -1 ||
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
