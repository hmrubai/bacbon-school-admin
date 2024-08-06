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
import { ConfirmService } from '../_helpers/confirm-dialog/confirm.service';

@Component({
  selector: 'app-tab-user-replace',
  templateUrl: './tab-user-replace.component.html',
  styleUrls: ['./tab-user-replace.component.scss']
})
export class TabUserReplaceComponent implements OnInit {

  id: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;

  modalTitle = 'Tab Users';
  entryForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  btnSaveText = 'Submit';
  loadingIndicator = false;
  filterForm: FormGroup;
  selectedLearnerId: string;
  page = new Page();
  rows = [];
  filteredData = [];

  subjectList: Array<any> = [];
  levelList: Array<any> = [];
  learnerList: Array<any> = [];

  // selected_count: number = 0;
  // selected_items: Array<any> = [];

  modalLgConfig: any = { class: 'gray modal-md', backdrop: 'static' };
  modalRef: BsModalRef;
  @ViewChild(DatatableComponent) tableComponent: DatatableComponent;

  baseUrl = environment.baseUrl;

  constructor(
    private modalService: BsModalService,
    private confirmService: ConfirmService,
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,

  ) {

    this.page.pageNumber = 0;
    this.page.size = 10;

  }


  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      name: [null],

    });
    this.entryForm = this.formBuilder.group({
      id: [null],
      selectAll: [false]
    });
    // this.getList();
  }

  get f() {
    return this.entryForm.controls;
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
  }

  getItem(item, template: TemplateRef<any>) {
    this.selectedLearnerId = item.ID
    this.learnerList = this.rows.filter(x => x.ID !== item.ID);
    this.learnerList.forEach(element => {
      element.selected = false;
    });
    // this.learnerList.forEach(s => {
    //   if (s.selected) {
    //     this.selected_items.push(s);
    //   }
    // });

    //  this.selected_count = this.selected_items.length;
    this.modalRef = this.modalService.show(template, this.modalLgConfig);

  }

  getList() {
    this.loadingIndicator = true;

    this._service.get('Learner/GetLearnersByDeviceNo/' + this.filterForm.value.name).subscribe(res => {
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

  filterList() {
    this.page.pageNumber = 0;
    this.getList();
  }



  // onFormSubmit() {
  //   this.submitted = true;
  //   if (this.entryForm.invalid) {
  //     return;
  //   }

  //   this.blockUI.start('Saving data. Please wait...');
  //   const obj = {
  //     Id: this.entryForm.value.Id,
  //     Name_bn: this.entryForm.value.Bangla,
  //     Name_en: this.entryForm.value.English,

  //   };

  //   this._service.post('Master/SaveOrUpdateTabUserReplace', obj).subscribe(

  //     data => {
  //       this.blockUI.stop();
  //       if (data.Status === 2) {
  //         this.toastr.warning(data.Message, 'Warning!', { timeOut: 2000 });
  //         return;
  //       }
  //       else if (data.Status === 1) {
  //         this.toastr.error(data.Message, 'Error!', { timeOut: 2000 });
  //         return;
  //       }
  //       this.toastr.success(data.Message, 'TabUserReplace', { timeOut: 2000 });
  //       this.modalHide()
  //       this.getList();

  //     },
  //     err => {
  //       this.blockUI.stop();
  //       this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
  //     }
  //   );

  // }

  onFormSubmit(template: TemplateRef<any>) {
    const oldLearnerIds = this.learnerList.filter(x => x.selected).map(function (x) { return x.ID; });

    if (oldLearnerIds.length === 0) {
      this.toastr.warning('Please select minimum one learner', 'Warning!', { timeOut: 2000 });
      return;
    }
    this.modalRef.hide();
    this.confirmService.confirm('Are you sure?', 'You want to replace the learner information?')
      .subscribe(
        result => {
          if (result) {
            this.modalRef = this.modalService.show(template, this.modalLgConfig);

            this.blockUI.start('Saving...');
            this._service.post('Learner/UpdateOldLearnerHistoryToLatestLearner/' + this.selectedLearnerId, oldLearnerIds).subscribe(
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
                this.modalHide();
                this.getList();
              },

              err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: false, enableHtml: true });
              }
            );
          }
         
        },
      );


  }

  modalHide() {
    this.entryForm.reset();
    this.modalRef.hide();
    this.submitted = false;
    this.modalTitle = 'Tab Users';
    this.btnSaveText = 'Submit';
    this.selectedLearnerId = null;
    this.learnerList = [];
  }



  selectAll(event) {
    this.learnerList.forEach(element => {
      element.selected = event.target.checked;
    });

    // this.selected_items = this.learnerList.filter(x => x.selected);
    // this.selected_count = this.selected_items.length;
  }

  // getSelected() {
  //   this.selected_items = this.learnerList.filter(s => {
  //     return s.selected;
  //   });
  //   this.selected_count = this.selected_items.length;
  // }
}
