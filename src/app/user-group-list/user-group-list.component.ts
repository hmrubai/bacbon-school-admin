import { Component, TemplateRef, ViewChild, ElementRef, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../_services/common.service';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Page } from '../_models/page';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
// import * as moment from 'moment';

@Component({
    selector: 'app-user-group-list',
    templateUrl: './user-group-list.component.html',
    encapsulation: ViewEncapsulation.None
})

export class UserGroupListComponent implements OnInit {

    entryForm: FormGroup;
    submitted = false;
    modalTitle = 'Create User';
    isUpdate = false;
    saveButtonText: string = 'Save';
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('dataTable') table: any;
    scrollBarHorizontal = (window.innerWidth < 1200);
    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    public categoryList: Array<any> = [];
    @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
    page = new Page();

    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private authService: AuthenticationService,
        private toastr: ToastrService,
        private router: Router
    ) {
        this.page.pageNumber = 0;
        this.page.size = 10;
        window.onresize = () => {
            this.scrollBarHorizontal = (window.innerWidth < 1200);
          };
    }


    ngOnInit() {

        this.getList();
    }



    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }



    getList() {
        this.loadingIndicator = true;
        const obj = {
            size: this.page.size,
            pageNumber: this.page.pageNumber
        };
        this._service.get('user-group/list', obj).subscribe(res => {
            this.loadingIndicator = false;
            if (!res.Success) {
                this.toastr.warning(res, 'Warning!', { closeButton: true, disableTimeOut: false });
                return;
            }
            this.rows = res.Records;
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

    toggleExpandRow(row) {
        if (!row.details) row.details = row.Roles.map(element => {
            return element = element.split('_').join(' ');
        });
        this.table.rowDetail.toggleExpandRow(row);

    }

    getItem(item) {
        this.router.navigate(['/user-group-entry', item.Id]);
    }




}
