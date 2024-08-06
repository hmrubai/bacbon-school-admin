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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-learner-list',
  templateUrl: './learner-list.component.html',
  styleUrls: ['./learner-list.component.scss']
})
export class LearnerListComponent implements OnInit {

  id: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;
  isCollapsed: boolean = true;
  modalTitle = 'Add Learner';
  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  btnSaveText = 'Save';
  loadingIndicator = false;
  filterForm: FormGroup;

  page = new Page();
  rows = [];
  filteredData = [];

  schoolList: Array<any> = [];
  classList: Array<any> = [];

  genderList = ["Male", "Female", "Others"];
  selectedGender: any;

  modalLgConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;
  baseUrl = environment.baseUrl;
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
      query: [null],
      gender: [null],
      tab: [null],
      class: [null],
      school: [null],
    });

    this.getList();
    this.getSchoolList();
    this.getClassList();
  }

  get f() {
    return this.entryForm.controls;
  }


  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  getSchoolList() {
    const obj = {
      areaId: null
    }
    this._service.get('Master/GetSchoolList',obj).subscribe(res => {
      this.schoolList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  getClassList() {
    this._service.get('Master/GetClassList').subscribe(res => {
      this.classList = res.Data;
    }, err => {
      this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
    });
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber,
      searchText: this.filterForm.value.query ? this.filterForm.value.query.trim() : "",
      gender: this.filterForm.value.gender ?? null,
      tab: this.filterForm.value.tab ?? null,
      schoolId: this.filterForm.value.school ,
      classId: this.filterForm.value.class ,
    };

    this._service.get('Learner/GetLearnerListWithPagination', obj).subscribe(res => {
      this.loadingIndicator = false;
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }
      this.rows = res.Data.List;
      this.page.totalElements = res.Data.TotalRows;
      this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
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




  modalHide() {
    this.entryForm.reset();
    this.filterForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Add Learner';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }
  resetFilterList() {
    this.filterForm.reset();
    this.getList();
  }
  filterList() {
    this.rows = [];
    this.page.pageNumber=0
    this.getList()
  }
  // filterDatatable(event) {

  //   const val = event.target.value.toLowerCase();
  //   if (val) {
  //     // filter our data
  //     const temp = this.filteredData.filter(function (d) {
  //       return d.Name.toLowerCase().indexOf(val) !== -1 ||
  //         d.Class.toLowerCase().indexOf(val) !== -1 ||
  //         !val;
  //     });
  //     this.rows = temp;
  //   }

  //   if (!val) this.rows = this.filteredData;

  //   this.page.pageNumber = 0;
  //   this.page.totalElements = this.rows.length;
  //   this.page.totalPages = this.page.totalElements / this.page.size;
  // }


}
