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
    selector: 'app-exam-participation-list',
    templateUrl: './exam-participation-list.component.html',
    styleUrls: ['./exam-participation-list.component.scss']
})
export class ExamParticipationListComponent implements OnInit {

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
  
    subjectList: Array<any> = [];
    levelList: Array<any> = [];

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

      if (this.route.snapshot.paramMap.has("id")) {
        this.id = this.route.snapshot.paramMap.get("id");
        this.getList(this.id);
      }
        this.page.pageNumber = 0;
        this.page.size = 20;
    }


    ngOnInit() {
     
    }

 
    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList(this.id);
      }

    getList(id) {
        this.loadingIndicator = true;
        // const obj = {
        //   size: this.page.size,
        //   pageNumber: this.page.pageNumber,
        //   id: id,
        // };
        this._service.get('Learner/GetOverAllSmallExamParticipationCountBySubject/'+id).subscribe(res => {
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
          this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
          setTimeout(() => {
            this.loadingIndicator = false;
          }, 1000);
        });
      }
  
   
   
}
