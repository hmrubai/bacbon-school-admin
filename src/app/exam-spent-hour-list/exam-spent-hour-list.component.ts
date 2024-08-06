import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Page } from '../_models/page';
import { CommonService } from '../_services/common.service';
import {  debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-exam-spent-hour-list',
    templateUrl: './exam-spent-hour-list.component.html',
    styleUrls: ['./exam-spent-hour-list.component.scss']
})
export class ExamSpentHourListComponent implements OnInit {

    id: string;
    isEdit: boolean;
    ColumnMode = ColumnMode;
    
    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    btnSaveText = 'Save';
    loadingIndicator = false;
    filterForm: FormGroup;

    page = new Page();
    rows = [];
    limit : number=2000;
    @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
    
    constructor(
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
        name: [null],
  
      });
      this.filterForm.get("name").valueChanges.pipe(debounceTime(700)).subscribe(() => {
            this.getList();
      })
            this.getList();
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
      }

    getList() {
        this.loadingIndicator = true;
       
        this._service.get('Learner/GetLearnerWiseBigExamList/'+this.limit ).subscribe(res => {
          this.loadingIndicator = false;
          // if (!res.Success) {
          //   this.toastr.warning(res, 'Warning!', { closeButton: true, disableTimeOut: false });
          //   return;
          // }
          this.rows = res;
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
