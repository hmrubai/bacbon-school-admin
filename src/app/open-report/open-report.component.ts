import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { AuthenticationService } from '../_services/authentication.service';
import { CommonService } from '../_services/common.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';


@Component({
    selector: 'app-open-report',
    templateUrl: './open-report.component.html',
    encapsulation: ViewEncapsulation.None
})

export class OpenReportComponent implements OnInit {

    @BlockUI() blockUI: NgBlockUI;

    courseList: Array<any> = [];
    traineeList: Array<any> = [];

    baseUrl = environment.baseUrl;
    filterForm: FormGroup;
    submitted = false;
    currentUser: any;
    reportList: Array<any> = [];
    bsConfig: Partial<BsDaterangepickerConfig>;
    bsValue: Date[] = [];
    maxDate: Date;

    @ViewChild('pdfViewerOnDemand', { static: false }) pdfViewerOnDemand: any;
    reportFileName: string;

    constructor(
        private authService: AuthenticationService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private toastr: ToastrService,
    ) {
        this.maxDate = new Date();
        this.maxDate.setDate(this.maxDate.getDate());
        this.currentUser = this.authService.currentUserDetails.value;
    }

    ngOnInit() {
        this.filterForm = this.formBuilder.group({
            date: [null, [Validators.required]],
            report: [null, [Validators.required]],
        });
        this.bsConfig = Object.assign({}, {
            isAnimated: true,
            adaptivePosition: true,
            rangeInputFormat: 'DD MMM YYYY'
        });
        this.getReportList();
    }

    get f() {
        return this.filterForm.controls;
    }

    getReportList() {
        this._service.get('department/dropdown-list').subscribe(res => {
            this.reportList = res.Records;
        }, err => {
            this.toastr.warning(err.message || err, 'warning!', { closeButton: true, disableTimeOut: false });
        });
    }

    showReport(reportType) {
        this.submitted = true;
        if (this.filterForm.invalid) return;


        this.blockUI.start('Generating report. Please wait...');

        const obj = {
            reportType: reportType === 'WebView' ? 'Pdf' : reportType,
            StartDate: moment(this.filterForm.value.date[0]).format('DD-MMM-YYYY'),
            EndDate: moment(this.filterForm.value.date[1]).format('DD-MMM-YYYY'),
        };

        this._service.downloadFile('course/get-trainee-wise-course-study-report', obj).subscribe(res => {
            this.submitted = false;
            this.blockUI.stop();
            if (reportType === 'WebView') {
                this.reportFileName = 'Call_History_Report.pdf'
                this.pdfViewerOnDemand.pdfSrc = res; // pdfSrc can be Blob or Uint8Array
                this.pdfViewerOnDemand.refresh();
                return;
            }

            const url = window.URL.createObjectURL(res);
            var link = document.createElement('a');
            link.href = url;
            link.download = "Call_History_Report." + (reportType === 'Excel' ? 'xlsx' : 'pdf');
            link.click();
        },
            err => {
                this.toastr.warning(err.message || err, 'Warning!');
                this.blockUI.stop();
            });
    }

    showIntitialReport(reportType) {
        this.submitted = true;


        this.blockUI.start('Generating report. Please wait...');

        const obj = {
            reportType: reportType === 'WebView' ? 'Pdf' : reportType,

        };

        this._service.downloadFile('course/get-trainee-wise-course-study-report', obj).subscribe(res => {
            this.submitted = false;
            this.blockUI.stop();
            if (reportType === 'WebView') {
                this.reportFileName = 'Input_Style_Form_Report.pdf'
                this.pdfViewerOnDemand.pdfSrc = res; // pdfSrc can be Blob or Uint8Array
                this.pdfViewerOnDemand.refresh();
                return;
            }

            const url = window.URL.createObjectURL(res);
            var link = document.createElement('a');
            link.href = url;
            link.download = "Input_Style_Form_Report." + (reportType === 'Excel' ? 'xlsx' : 'pdf');
            link.click();
        },
            err => {
                this.toastr.warning(err.message || err, 'Warning!');
                this.blockUI.stop();
            });
    }
}
