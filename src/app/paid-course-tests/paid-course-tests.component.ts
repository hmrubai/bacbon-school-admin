import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../_services/common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Page } from '../_models/page';
import { AuthenticationService } from '../_services/authentication.service';
import { environment } from 'src/environments/environment';
import { AuthorizationService } from '../_services/authorization.service';
import { ConfirmService } from 'src/app/_helpers/confirm-dialog/confirm.service';
declare var $: any;
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-paid-course-tests',
    templateUrl: './paid-course-tests.component.html',
    styleUrls: ['./paid-course-tests.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PaidCourseTestComponent implements OnInit {
    isCollapsed: boolean = true;
    currentUser: any;

    baseUrl = environment.baseUrl;
    highcharts = Highcharts;

    counter = { Learners: 0, Scripts: 0, Videos: 0, SmallTests: 0, Tabs: 0, Schools: 0 };
    pendingLeaveRequest = { list: [], total: 0 };
    gender = { list: [], total: 0 };
    age = { list: [], total: 0 };
    school = { list: [], total: 0 };
    academicClass = { list: [], total: 0 };
    learners = { list: [], total: 0 };
    chart = { list: [], total: 0 };
    subjects = { name: null, Videos: [], total: 0 };
    //duration = { subject : null, chartData: [], chartOption: null }
    duration = []
    location = []
    page = new Page();

    modalTitle = 'Add Paid Course Test';
    entryForm: FormGroup;
    submitted = false;
    btnSaveText = 'Save';

    file: File;
    arrayBuffer: any;
    filelist: any;

    importedData:any;
    dataImported = false;

    loggedInUsers = [];

    selectionTest = [];
    paidCourseList = [];
    allTestList = [];

    callHistory = { list: [], total: 0 };

    registeredUser = 0;
    video = 0;
    doc = 0;
    exam = 0;
    smallTest = 0;
    bigTest = 0;
    itemsPerSlide = 4;

    paid_course_id;

    is_update = false;

    rows = [];
    classes = [];

    testType = [
        {
            id: 'RevisionTest',
            name: 'Revision/Daily/Chapter Test'
        },
        {
            id: 'ModelTest',
            name: 'Model Test'
        },
        {
            id: 'WeeklyTest',
            name: 'Weekly Test/Review Test'
        },
        {
            id: 'PaperTest',
            name: 'Paper Test'
        },
        {
            id: 'SubjectTest',
            name: 'Subject Test'
        },
        {
            id: 'MedicalPreviousQB',
            name: 'Medical Previous Year Question Bank'
        },
        {
            id: 'DentalPreviousQB',
            name: 'Dental Previous Year Question Bank'
        }
    ]

    @BlockUI() blockUI: NgBlockUI;

    modalLgConfigSm: any = { class: 'gray modal-md', backdrop: 'static' };
    modalLgConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalRef: BsModalRef;
    bsConfig: Partial<BsDatepickerConfig>;
    minDate;

    Highcharts: typeof Highcharts = Highcharts;

    genderChartOptions: any;
    ageChartOptions: any;
    schoolChartOptions: any;
    classChartOptions: any;
    locationChartOptions: any;
    durationChartOptions: any;

    constructor(
        private _service: CommonService,
        private toastr: ToastrService,
        public formBuilder: FormBuilder,
        private router: Router,
        private routerLocation: Location,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private confirmService: ConfirmService,
        private authService: AuthenticationService,
        public authorizationService: AuthorizationService
    ) {
        this.currentUser = this.authService.currentUserDetails.value;
        this.page.pageNumber = 0;
        this.page.size = 5;
        this.paid_course_id = this.route.snapshot.paramMap.get("paid_course_id");
        this.minDate = this.getDateTimeFormat(new Date());
    }

    ngOnInit() {

        this.bsConfig = Object.assign({}, {
            isAnimated: true,
            adaptivePosition: true,
            dateInputFormat: 'DD-MM-YYYY'
        });

        this.entryForm = this.formBuilder.group({
            id: [null],
            paid_course_id: [null, [Validators.required, Validators.maxLength(250)]],
            paid_course_subject_id: [null],
            name: [null, [Validators.required, Validators.maxLength(250)]],
            name_bn: [null, [Validators.maxLength(250)]],
            test_type: [null, [Validators.required, Validators.maxLength(250)]],
            quiz_duration: [60, [Validators.required]],
            quiz_positive_mark: [1, [Validators.required]],
            quiz_negative_mark: [0.25, [Validators.required]],
            quiz_total_mark: [60, [Validators.required]],
            quiz_question_number: [60, [Validators.required]],
            sort: [0, [Validators.required]], 
            description: [null],
            has_schedule: [false], 
            appeared_from: [null],
            appeared_to: [null],
        });

        this.entryForm.controls['paid_course_id'].setValue(this.paid_course_id);

        this.getAllPaidCourseTestList();

    }

    get f() {
        return this.entryForm.controls;
    }

    getAllPaidCourseTestList() {
        let params = {
            paid_course_id: this.paid_course_id
        }
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('paid-course/get-all-test', params).subscribe(res => {
            this.allTestList = res.result;
            this.entryForm.controls['sort'].setValue(res.result.length + 1);
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalLgConfig);
    }

    openUploadTestModal(template: TemplateRef<any>) {
        this.modalTitle = 'Upload Paid Course Test via Excel';
        this.btnSaveText = 'Upload';
        this.modalRef = this.modalService.show(template, this.modalLgConfigSm);
    }

    editPCTest(item, template: TemplateRef<any>){
        this.modalTitle = 'Update Paid Course Test';
        this.btnSaveText = 'Update';
        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['paid_course_id'].setValue(item.paid_course_id);
        this.entryForm.controls['name'].setValue(item.name);
        this.entryForm.controls['name_bn'].setValue(item.name_bn);
        this.entryForm.controls['test_type'].setValue(item.test_type);
        this.entryForm.controls['has_schedule'].setValue(item.has_schedule);
        this.entryForm.controls['quiz_duration'].setValue(item.quiz_duration);
        this.entryForm.controls['quiz_question_number'].setValue(item.quiz_question_number);
        this.entryForm.controls['quiz_positive_mark'].setValue(item.quiz_positive_mark);
        this.entryForm.controls['quiz_negative_mark'].setValue(item.quiz_negative_mark);
        this.entryForm.controls['quiz_total_mark'].setValue(item.quiz_total_mark);
        this.entryForm.controls['sort'].setValue(item.sort);
        this.entryForm.controls['description'].setValue(item.description);
        if(item.appeared_from){
            this.entryForm.controls['appeared_from'].setValue(this.getDateFormatModal(item.appeared_from));
        }
        if(item.appeared_to){
            this.entryForm.controls['appeared_to'].setValue(this.getDateFormatModal(item.appeared_to));
        }

        this.openModal(template);
    }

    modalHide() {
        this.modalRef.hide();
        this.entryForm.reset();
        this.submitted = false;
        this.is_update = false;
        this.entryForm.controls['paid_course_id'].setValue(this.paid_course_id);
        this.entryForm.controls['sort'].setValue(this.allTestList.length + 1);
        this.importedData = [];
        this.modalTitle = 'Add Paid Course Test';
        this.btnSaveText = 'Save';
    }

    addfile(event) {
        this.file = event.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(this.file);
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, { type: "binary" });
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            this.importedData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
            this.dataImported = true;
            this.filelist = this.file;
            console.log(this.importedData)
        }
    }

    onFormSubmit() {
        this.submitted = true;

        if (this.entryForm.invalid) {
            return;
        }

        let appeared_from = null;
        let appeared_to = null;

        if(this.entryForm.value.appeared_from){
            appeared_from = this.validateDateTimeFormat(this.entryForm.value.appeared_from);
        }
        if(this.entryForm.value.appeared_to){
            appeared_to = this.validateDateTimeFormat(this.entryForm.value.appeared_to);
        }

        // if(!this.importedData){
        //     this.toastr.warning('Please, Attach question!', 'Warning!', { closeButton: true, disableTimeOut: false });
        //     return;
        // }

        this.blockUI.start('Saving data. Please wait...');
        const obj = {
            id: this.entryForm.value.id,
            paid_course_id: this.entryForm.value.paid_course_id,
            name: this.entryForm.value.name,
            name_bn: this.entryForm.value.name_bn,
            test_type: this.entryForm.value.test_type,
            has_schedule: this.entryForm.value.has_schedule,
            quiz_duration: this.entryForm.value.quiz_duration,
            quiz_positive_mark: this.entryForm.value.quiz_positive_mark,
            quiz_negative_mark: this.entryForm.value.quiz_negative_mark,
            quiz_total_mark: this.entryForm.value.quiz_total_mark,
            quiz_question_number: this.entryForm.value.quiz_question_number,
            sort: this.entryForm.value.sort,
            appeared_from: appeared_from,
            appeared_to: appeared_to,
            description: this.entryForm.value.description,
            questions: this.importedData ? this.importedData : []
        };

        this._service.post('paid-course/create-test', obj).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getAllPaidCourseTestList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    onUpdateFormSubmit() {
        this.submitted = true;

        if (this.entryForm.invalid) {
            return;
        }

        let appeared_from = null;
        let appeared_to = null;

        if(this.entryForm.value.appeared_from){
            appeared_from = this.validateDateTimeFormat(this.entryForm.value.appeared_from);
        }
        if(this.entryForm.value.appeared_to){
            appeared_to = this.validateDateTimeFormat(this.entryForm.value.appeared_to);
        }

        this.blockUI.start('Updating data. Please wait...');
        const obj = {
            id: this.entryForm.value.id,
            paid_course_id: this.entryForm.value.paid_course_id,
            name: this.entryForm.value.name,
            name_bn: this.entryForm.value.name_bn,
            test_type: this.entryForm.value.test_type,
            has_schedule: this.entryForm.value.has_schedule,
            quiz_duration: this.entryForm.value.quiz_duration,
            quiz_positive_mark: this.entryForm.value.quiz_positive_mark,
            quiz_negative_mark: this.entryForm.value.quiz_negative_mark,
            quiz_total_mark: this.entryForm.value.quiz_total_mark,
            quiz_question_number: this.entryForm.value.quiz_question_number,
            sort: this.entryForm.value.sort,
            description: this.entryForm.value.description,
            appeared_from: appeared_from,
            appeared_to: appeared_to
        };

        this._service.post('paid-course/update-test', obj).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getAllPaidCourseTestList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    onUpdateTestFormSubmit() {
        let params = {
            paid_course_id: this.paid_course_id,
            data: this.importedData
        }

        if(!this.importedData){
            this.toastr.warning('Please, Attach Test File!', 'Warning!', { closeButton: true, disableTimeOut: false });
            return;
        }
        
        this.blockUI.start('Uploading Test, Please wait...');
        console.log(params)
        this._service.post('paid-course/upload-test-via-excel', params).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getAllPaidCourseTestList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    deleteSelectionTest(item){
        this.confirmService.confirm('Are you sure?', 'Do you want to delete?.', "Yes, delete")
        .subscribe(
            result => {
                if (result) {
                    this._service.post('deleteSelectionTest', { id : item.id }).subscribe(
                        data => {
                            console.log(item)
                            this.blockUI.stop();
                            this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                            this.getAllPaidCourseTestList();
                        },
                        err => {
                            this.blockUI.stop();
                            this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                        }
                    );
                }
            });
    }

    downloadSample() {
        return this._service.downloadFile('Learner/GetLearnerWiseSmallExamListExcel').subscribe(res => {
            const url = window.URL.createObjectURL(res);
            var link = document.createElement('a');
            link.href = url;
            link.download = "test-spend-hours.xlsx";
            link.click();

        },
            error => {
                this.toastr.warning(error.message || error, 'Error!', { timeOut: 2000, closeButton: true, disableTimeOut: false, enableHtml: true });
            });
    }

    getDateTimeFormat(value: Date) {
        return moment(value).format('DD-MMM-YYYY hh:mm A');
    }

    getDateFormat(value: Date) {
        return moment(value).format('DD-MMM-YYYY');
    }

    getDateFormatModal(value: Date) {
        return moment(value).format('yyyy-MM-DDTHH:mm:ss');
    }

    validateMinDateFormat(value: Date) {
        return moment(value).format('YYYY-MM-DD');
    }

    validateDateTimeFormat(value: Date) {
        return moment(value).format('YYYY-MM-DD hh:mm A');
    }

    backToLocation(){
        this.routerLocation.back();
    }

}
