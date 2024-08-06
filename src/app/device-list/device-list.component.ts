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
import { MatDialog } from '@angular/material/dialog';
import { UploadDialogComponent } from '../_helpers/upload-dialog/dialog.component';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {

  id: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;

  modalTitle = 'Add Device';
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
  baseUrl = environment.baseUrl;
  @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
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
      name: [null],

    });
  
    this.getList();
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
      size: this.page.size,
      pageNumber: this.page.pageNumber,
     // name: this.filterForm.value.name? this.filterForm.value.name.trim() : null,
    };
    this._service.get('Master/GetDeviceList',obj).subscribe(res => {
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
      this.page.totalElements = res.Data.Total;
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
    this.modalTitle = 'Add Device';
    this.btnSaveText = 'Save';
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.modalLgConfig);
  }
  resetFilterList() {
    this.filterForm.reset();
    this.getList();
  }
  public openUploadDialogDevice() {
    let dialogRef = this.dialog.open(UploadDialogComponent, { data: { url: this._service.generateUrl('Master/UploadDeviceInfo'), whiteList: ['xlsx', 'xls'], uploadtext: 'Please upload an Excel file', title: 'Upload File' }, width: '50%', height: '50%' })
       .afterClosed()
       .subscribe(response => {
          if (response) {
             this.toastr.success(response, 'Success!', { timeOut: 2000 });
             this.getList();
          }
       });
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

  downloadSample() {
    return this._service.downloadFile('Master/download-device-sample-file').subscribe(res => {
      const url = window.URL.createObjectURL(res);
      var link = document.createElement('a');
      link.href = url;
      link.download = "device_sample_file.xlsx";
      link.click();

    },
      error => {
        this.toastr.warning(error.message || error, 'Error!', { timeOut: 2000, closeButton: true, disableTimeOut: false, enableHtml: true });
      });
  }
}
