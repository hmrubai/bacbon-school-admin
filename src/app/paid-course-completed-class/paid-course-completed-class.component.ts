import { Component, OnInit, TemplateRef, ViewEncapsulation, ViewChild  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
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

@Component({
    selector: 'app-paid-course-completed-class',
    templateUrl: './paid-course-completed-class.component.html',
    styleUrls: ['./paid-course-completed-class.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PaidCourseCompletedClassComponent implements OnInit {
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
    ColumnMode = ColumnMode;

    modalTitle = 'Add Paid Course';
    entryForm: FormGroup;
    uploadForm: FormGroup;
    submitted = false;
    btnSaveText = 'Save';
    loadingIndicator = false;

    allCouponList = [];
    allPaidCourseList = [];
    allPaidCourseMeterialList = [];
    paidCourseResultList = [];

    subjectWiseResult = []

    loggedInUsers = [];

    selectionTest = [];
    appliedCouponList = [];

    callHistory = { list: [], total: 0 };

    registeredUser = 0;
    video = 0;
    doc = 0;
    exam = 0;
    smallTest = 0;
    bigTest = 0;
    itemsPerSlide = 4;

    rows = [];
    classes = [];

    meterial_form;
    is_meterial_selected = false;

    urls = [];
    files = [];

    @BlockUI() blockUI: NgBlockUI;

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
    
    @ViewChild(DatatableComponent) tableComponent: DatatableComponent;

    constructor(
        private _service: CommonService,
        private toastr: ToastrService,
        public formBuilder: FormBuilder,
        private modalService: BsModalService,
        private confirmService: ConfirmService,
        private authService: AuthenticationService,
        public authorizationService: AuthorizationService
    ) {
        this.currentUser = this.authService.currentUserDetails.value;
        this.page.pageNumber = 0;
        this.page.size = 5;
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
            exam_name: [null, [Validators.required, Validators.maxLength(250)]],
            duration: [null, [Validators.required, Validators.maxLength(250)]],
            positive_mark: [1, [Validators.required, Validators.maxLength(250)]],
            negative_mark: [0, [Validators.required, Validators.maxLength(250)]],
            total_mark: [null, [Validators.required, Validators.maxLength(250)]],
            //question_number: [null, [Validators.required, Validators.maxLength(250)]],
            appeared_from: [null, [Validators.required, Validators.maxLength(250)]],
            appeared_to: [null, [Validators.required, Validators.maxLength(250)]],
        });

        this.uploadForm = this.formBuilder.group({
            attachment: ['']
        });

        this.getAllPaidCourseList();
        //this.getAllCouponList();
    }

    get f() {
        return this.entryForm.controls;
    }

    getAllAppliedCouponList() {
        this.blockUI.start('Getting data. Please wait...');
        this.loadingIndicator = true;
        this._service.get('paid-course/applied-coupon-list').subscribe(res => {
            this.appliedCouponList = res.result;
            setTimeout(() => {
                this.loadingIndicator = false;
                this.tableComponent.recalculate();
              }, 1000);
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    getAllPaidCourseList() {
        this.blockUI.start('Getting data. Please wait...');
        this.loadingIndicator = true;
        this._service.get('paid-course/get-all-paid-courses').subscribe(res => {
            this.allPaidCourseList = res.result;
            setTimeout(() => {
                this.loadingIndicator = false;
                this.tableComponent.recalculate();
              }, 1000);
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    getAllCouponList() {
        this.blockUI.start('Getting data. Please wait...');
        this.loadingIndicator = true;
        this._service.get('web/coupon-dropdown-list').subscribe(res => {
            this.allCouponList = res.result;
            setTimeout(() => {
                this.loadingIndicator = false;
                this.tableComponent.recalculate();
              }, 1000);
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    changePaidCourse(paid_course){
        if(paid_course){
            this.blockUI.start('Getting data. Please wait...');
            this.loadingIndicator = true;
            this._service.get('paid-course/test-list-by-id/' + paid_course.id).subscribe(res => {
                this.allPaidCourseMeterialList = res.result;
                this.is_meterial_selected = false;
                this.loadingIndicator = false;
                this.blockUI.stop();
            }, err => {
                this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                this.blockUI.stop();
            });
        }else{
            this.allPaidCourseMeterialList = [];
            this.meterial_form = null;
            this.is_meterial_selected = false;
            this.getAllPaidCourseList();
        }
    }

    filterResultList(course_meterial){
        if(course_meterial){
        this.blockUI.start('Getting Result. Please wait...');
            this.loadingIndicator = true;
            this.is_meterial_selected = true;
            this._service.get('paid-course/merit-list/' + course_meterial.id).subscribe(res => {
                this.paidCourseResultList = res.result;
                this.is_meterial_selected = true;
                setTimeout(() => {
                    this.loadingIndicator = false;
                    this.tableComponent.recalculate();
                  }, 1000);
                this.blockUI.stop();
            }, err => {
                this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                this.blockUI.stop();
            });
        }else{
            this.is_meterial_selected = false;
            this.meterial_form = null;
        }
    }

    getSubjectWiseResult(result, template: TemplateRef<any>){
        this._service.get('web/subject-wise-result/' + result.id).subscribe(res => {
            this.subjectWiseResult = res.result;
            this.blockUI.stop();
            this.openModal(template);
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }


    downloadResult(){
        this.blockUI.start('Generating report. Please wait...');
        this._service.downloadFile('paid-course/test-result-excel/' + this.meterial_form).subscribe(res => {
            this.blockUI.stop();

            const url = window.URL.createObjectURL(res);
            var link = document.createElement('a');
            link.href = url;
            link.download = "Paid Course Test Result";
            link.click();
        },
        err => {
            this.toastr.warning(err.messages || err, 'Warning!');
            this.blockUI.stop();
        });
    }

    filtercOuponList(coupon){
        if(coupon){
            this.blockUI.start('Getting data. Please wait...');
            this.loadingIndicator = true;
            this._service.get('paid-course/applied-coupon-list/' + coupon.id).subscribe(res => {
                this.appliedCouponList = res.result;
                setTimeout(() => {
                    this.loadingIndicator = false;
                    this.tableComponent.recalculate();
                  }, 1000);
                this.blockUI.stop();
            }, err => {
                this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                this.blockUI.stop();
            });
        }else{
            this.getAllAppliedCouponList();
        }
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalLgConfig);
    }

    editSelectionTest(item, template: TemplateRef<any>){
        this.modalTitle = 'Update Paid Course';
        this.btnSaveText = 'Update';
        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['exam_name'].setValue(item.exam_name);
        this.entryForm.controls['duration'].setValue(item.duration);
        this.entryForm.controls['positive_mark'].setValue(item.positive_mark);
        this.entryForm.controls['negative_mark'].setValue(item.negative_mark);
        this.entryForm.controls['total_mark'].setValue(item.total_mark);
        //this.entryForm.controls['question_number'].setValue(item.question_number);
        this.entryForm.controls['appeared_from'].setValue(this.getDateFormatModal(item.appeared_from));
        this.entryForm.controls['appeared_to'].setValue(this.getDateFormatModal(item.appeared_to));
        console.log(this.getDateFormatModal(item.appeared_from))

        this.openModal(template);
    }

    modalHide() {
        this.modalRef.hide();
        this.entryForm.reset();
        this.submitted = false;
        this.modalTitle = 'Add Paid Course';
        this.btnSaveText = 'Save';
    }

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Saving data. Please wait...');
        const obj = {
            id: this.entryForm.value.id,
            exam_name: this.entryForm.value.exam_name,
            duration: this.entryForm.value.duration,
            positive_mark: this.entryForm.value.positive_mark,
            negative_mark: this.entryForm.value.negative_mark,
            total_mark: this.entryForm.value.total_mark,
            //question_number: this.entryForm.value.question_number,
            appeared_from: this.validateDateTimeFormat(this.entryForm.value.appeared_from),
            appeared_to: this.validateDateTimeFormat(this.entryForm.value.appeared_to)
        };

        this._service.post('createSelectionTest', obj).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getAllAppliedCouponList();
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
                            this.getAllAppliedCouponList();
                        },
                        err => {
                            this.blockUI.stop();
                            this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                        }
                    );
                }
            });
    }

    getAllCount() {
        this._service.get('Learner/GetDashboardCount').subscribe(res => {
            if (res.Status === 2) {
                this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
                return;
            }
            else if (res.Status === 1) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }

            this.counter = res.Data;
        }, err => {
            this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
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


    refreshComponent() {
        this.getAllCount();
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

}
