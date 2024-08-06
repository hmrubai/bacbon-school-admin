import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Page } from '../_models/page';
import { CommonService } from '../_services/common.service';
import {  debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-test-spent-hour-list',
    templateUrl: './test-spent-hour-list.component.html',
    styleUrls: ['./test-spent-hour-list.component.scss']
})
export class TestSpentHourListComponent implements OnInit {

    id: string;
    isEdit: boolean;
    ColumnMode = ColumnMode;
    
    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    btnSaveText = 'Save';
    loadingIndicator = false;
    filterForm: FormGroup;
    baseUrl;
    page = new Page();
    rows = [];
    filteredData = [];
    limit : number=2000;
  
    @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
    
    constructor(
      public formBuilder: FormBuilder,
      private _service: CommonService,
      private toastr: ToastrService,
      private router: Router,
      private route: ActivatedRoute
  ) {
    if (this.route.snapshot.paramMap.has("id") && this.route.snapshot.paramMap.has("id")) {
      this.id = this.route.snapshot.paramMap.get("id");
      this.getList();
    }
    this.baseUrl = environment.baseUrl;
      this.page.pageNumber = 0;
      this.page.size = 20;
  }


  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      name: [null],

    });
   
  }

  setPage(pageInfo) {
      this.page.pageNumber = pageInfo.offset;
      this.getList();
    }

  getList() {
      this.loadingIndicator = true;
      this._service.get('Learner/GetLearnerWiseSmallExamList/' +this.id+"/"+ this.limit).subscribe(res => {
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
        this.filteredData= this.rows
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

    filterDatatable(event) {

      const val = event.target.value.toLowerCase();
      if (val) {
        // filter our data
        const temp = this.filteredData.filter(function (d) {
          return d.LearnerName.toLowerCase().indexOf(val) !== -1 ||
            d.Mobile.toLowerCase().indexOf(val) !== -1 ||
            !val;
        });
        this.rows = temp;
      }
  
      if (!val) this.rows = this.filteredData;
      this.page.totalElements = this.rows.length;
      this.page.totalPages = this.page.totalElements / this.page.size;
     
    }
 
   
}
