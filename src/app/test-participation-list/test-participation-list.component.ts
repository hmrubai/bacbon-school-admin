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
    selector: 'app-test-participation-list',
    templateUrl: './test-participation-list.component.html',
    styleUrls: ['./test-participation-list.component.scss']
})
export class TestParticipationListComponent implements OnInit {

    id: string;
    isEdit: boolean;
    subject : any;
    count : any;
    ColumnMode = ColumnMode;
    
    modalTitle = 'Add Video';
    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    btnSaveText = 'Save';
    loadingIndicator = false;
    filterForm: FormGroup;
    filteredData = [];

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
      this.page.pageNumber = 0;
      this.page.size = 20;
      if (this.route.snapshot.paramMap.has("id")) {
        this.id = this.route.snapshot.paramMap.get("id");
        this.getList();
      }
        
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
        const obj = {
          size: this.page.size,
          pageNumber: this.page.pageNumber,
          subjectId: this.id,
          classId: null,
        };
        this._service.get('Learner/GetSmallTestParticipationCount',obj).subscribe(res => {
          this.loadingIndicator = false;
          if (res.Status === 2) {
            this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
            return;
          }
          else if (res.Status === 1) {
            this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
            return;
          }
          res.Data.forEach(element => {
            this.subject= element.Name
            this.count= element.Count
            this.rows=element.SmallTests
          });
          this.filteredData = this.rows;
         // this.rows = res.Data.SmallTests;
          this.page.totalElements =  this.count;
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
  
      filterDatatable(event) {

        const val = event.target.value.toLowerCase();
        if (val) {
          // filter our data
          const temp = this.filteredData.filter(function (d) {
            return d.Name.toLowerCase().indexOf(val) !== -1 ||
              d.Participation.toLowerCase().indexOf(val) !== -1 ||
              !val;
          });
          this.rows = temp;
        }
    
        if (!val) this.rows = this.filteredData;
    
       
      }
   
}
