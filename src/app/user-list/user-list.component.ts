import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from '../_helpers/must-match.validator';
import { Page } from '../_models/page';
import { AuthenticationService } from '../_services/authentication.service';
import { CommonService } from '../_services/common.service';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

    @BlockUI() blockUI: NgBlockUI;
    @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
    rows = [];
    loadingIndicator = false;
    ColumnMode = ColumnMode;
    public categoryList: Array<any> = [];
    scrollBarHorizontal = (window.innerWidth < 1200);
    page = new Page();

    constructor(
        private _service: CommonService,
        private toastr: ToastrService
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
        this._service.get('account/get-user-list', obj).subscribe(res => {
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
}
