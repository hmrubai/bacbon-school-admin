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
import { Location } from '@angular/common';


@Component({
    selector: 'app-participant-list',
    templateUrl: './participant-list.component.html',
    styleUrls: ['./participant-list.component.scss']
})
export class ParticipantListComponent implements OnInit {

    id: string;
    isEdit: boolean;
    ColumnMode = ColumnMode;
    isCollapsed: boolean = true;
    modalTitle = 'Update Quota';
    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    btnSaveText = 'Update';
    loadingIndicator = false;
    filterForm: FormGroup;
    quotaChangeForm: FormGroup;

    page = new Page();
    rows = [];
    filteredData = [];
    selectionTest;
    is_loaded = false;

    selection_test_id;

    min_value = 1;

    schoolList: Array<any> = [];
    classList: Array<any> = [];
    selectionQuotaList;

    genderList = ["Male", "Female", "Others"];
    selectedGender: any;

    modalLgConfig: any = { class: 'gray modal-sm', backdrop: 'static' };
    modalRef: BsModalRef;
    baseUrl = environment.baseUrl;
    @ViewChild(DatatableComponent) tableComponent: DatatableComponent;
    constructor(
        private modalService: BsModalService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.page.pageNumber = 0;
        this.page.size = 500;

        this.selection_test_id = this.route.snapshot.paramMap.get("selection_test_id");
    }


    ngOnInit() {
        this.filterForm = this.formBuilder.group({
            query: [null],
            gender: [null],
            tab: [null],
            class: [null],
            school: [null],
        });

        this.quotaChangeForm = this.formBuilder.group({
            id: [null],
            quota: [0],
            consumption: [0]
        });

        if(this.selection_test_id){
            this.getSelectionTestDetails();
            this.getParticipantList();
        }
    }

    get f() {
        return this.entryForm.controls;
    }

    get qf() {
        return this.quotaChangeForm.controls;
    }

    getSelectionTestDetails(){
        this._service.get('getSelectionTestDetailsByID/' + this.selection_test_id).subscribe(res => {
            this.selectionTest = res.result;
            this.is_loaded = true;
        }, err => {
            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
    }

    getParticipantList(){
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('getAllSelectionTestQuotaList/' + this.selection_test_id).subscribe(res => {
            this.selectionQuotaList = res.result;
            this.page.totalElements = res.result.length;
            this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    chnageQuota(item, template: TemplateRef<any>){
        this.quotaChangeForm.controls['id'].setValue(item.id);
        this.quotaChangeForm.controls['quota'].setValue(item.quota);
        this.quotaChangeForm.controls['consumption'].setValue(item.consumption);
        this.min_value = item.quota;
        this.openModal(template);
    }

    onFormSubmit(){
        if(this.quotaChangeForm.value.quota < this.quotaChangeForm.value.consumption){
            this.toastr.warning('Quota must be greater than consumption!', 'Warning!', { closeButton: true, disableTimeOut: false });
            return;
        }
        this._service.post('updateQuota', this.quotaChangeForm.value).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.message, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getParticipantList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    downloadResult(){
        this.blockUI.start('Generating report. Please wait...');
        this._service.downloadFile('getSelectionTestResult/' + this.selection_test_id).subscribe(res => {
            this.blockUI.stop();

            const url = window.URL.createObjectURL(res);
            var link = document.createElement('a');
            link.href = url;
            link.download = "Selection Test Result";
            link.click();
        },
        err => {
            this.toastr.warning(err.messages || err, 'Warning!');
            this.blockUI.stop();
        });
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getList();
    }

    getSchoolList() {
        const obj = {
            areaId: null
        }
        this._service.get('Master/GetSchoolList', obj).subscribe(res => {
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
            schoolId: this.filterForm.value.school,
            classId: this.filterForm.value.class,
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
        this.quotaChangeForm.reset();
        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Update Quota';
        this.btnSaveText = 'Update';
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
        this.page.pageNumber = 0
        this.getList()
    }

    backToLocation() {
        this.location.back();
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
