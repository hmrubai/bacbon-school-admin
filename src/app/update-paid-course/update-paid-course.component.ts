import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../_services/common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { Page } from '../_models/page';
import { AuthenticationService } from '../_services/authentication.service';
import { environment } from 'src/environments/environment';
import { AuthorizationService } from '../_services/authorization.service';
import { ConfirmService } from 'src/app/_helpers/confirm-dialog/confirm.service';
import { Location } from '@angular/common';
declare var $: any;
import * as Highcharts from 'highcharts';
import * as moment from 'moment';

@Component({
    selector: 'app-update-paid-course',
    templateUrl: './update-paid-course.component.html',
    styleUrls: ['./update-paid-course.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UpdatePaidCourseComponent implements OnInit {
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

    features = [];
    description_destais = [];

    modalTitle = 'Add Paid Course';
    entryForm: FormGroup;
    featuresForm: FormGroup;

    uploadIconForm: FormGroup;
    uploadThumbnailForm: FormGroup;
    uploadScheduleForm: FormGroup;

    descriptionDetailsForm: FormGroup;
    submitted = false;
    btnSaveText = 'Save';

    loggedInUsers = [];

    selectionTest = [];

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

    iconFiles = [];
    thumbnailFiles = [];
    schesuleFiles = [];
    solvedClassFiles = [];

    paid_course_id;

    paidCourseDetails;

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

    promoStatus = [
        {
            id: "New",
            name: "New"
        },
        {
            id: "Hot",
            name: "Hot"
        },
        {
            id: "Free",
            name: "Free"
        }
    ]

    courseType = [
        {
            id: "universityAdmissionCourse",
            name: "universityAdmissionCourse"
        },
        {
            id: "medicalAdmissionCourse",
            name: "medicalAdmissionCourse"
        }
    ]

    constructor(
        private routeLocation: Location,
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
        this.minDate = this.getDateTimeFormat(new Date());
        
        this.paid_course_id = this.route.snapshot.paramMap.get("paid_course_id");
        
    }

    ngOnInit() {

        this.bsConfig = Object.assign({}, {
            isAnimated: true,
            adaptivePosition: true,
            dateInputFormat: 'DD-MM-YYYY'
        });

        this.entryForm = this.formBuilder.group({
            id: [null],
            name: [null, [Validators.required, Validators.maxLength(250)]],
            name_bn: [null, [Validators.required, Validators.maxLength(250)]],
            course_type: ['universityAdmissionCourse', [Validators.required]],
            folder_name: [''],
            description: [''],
            youtube_url: [null],
            thumbnail: [null, [Validators.maxLength(250)]],
            paid_course_icon: [null, [Validators.maxLength(250)]],
            course_schedule: [null],
            course_class_schedule: [null],
            coupon_code: [null],
            regular_amount: [0],
            sales_amount: [0, [Validators.required, Validators.maxLength(250)]],
            discount_percentage: [0],
            number_of_videos: [0],
            number_of_scripts: [0],
            number_of_quizzes: [0],
            number_of_model_tests: [0],
            promo_status: [null],
            is_active: [false],
            is_cunit: [false],
            has_trail: [false],
            is_only_test: [false],
            sort: [null, [Validators.required, Validators.maxLength(250)]],
            appeared_from: [null, [Validators.required, Validators.maxLength(250)]],
            appeared_to: [null, [Validators.required, Validators.maxLength(250)]],
        });

        this.uploadIconForm = this.formBuilder.group({
            icon_file: ['']
        });

        this.uploadThumbnailForm = this.formBuilder.group({
            thumbnail_file: ['']
        });

        this.uploadScheduleForm = this.formBuilder.group({
            paid_course_schedule: [''],
            paid_course_solved: [''],
        });

        this.featuresForm = this.formBuilder.group({
            name: [null, [Validators.required, Validators.maxLength(500)]],
        });

        this.descriptionDetailsForm = this.formBuilder.group({
            title: [null, [Validators.required, Validators.maxLength(250)]],
            details: [null, [Validators.required, Validators.maxLength(500)]],
        });

        this.getPaidCourseDetails();

    }

    get f() {
        return this.entryForm.controls;
    }

    getPaidCourseDetails() {
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('paid-course/details-by-id/' + this.paid_course_id).subscribe(res => {
            this.paidCourseDetails = res.result;
            this.entryForm.controls['id'].setValue(this.paidCourseDetails.id);
            this.entryForm.controls['name'].setValue(this.paidCourseDetails.name);
            this.entryForm.controls['name_bn'].setValue(this.paidCourseDetails.name_bn);
            this.entryForm.controls['course_type'].setValue(this.paidCourseDetails.course_type);
            this.entryForm.controls['description'].setValue(this.paidCourseDetails.description);
            this.entryForm.controls['youtube_url'].setValue(this.paidCourseDetails.youtube_url);
            this.entryForm.controls['regular_amount'].setValue(this.paidCourseDetails.regular_amount);
            this.entryForm.controls['sales_amount'].setValue(this.paidCourseDetails.sales_amount);
            this.entryForm.controls['discount_percentage'].setValue(this.paidCourseDetails.discount_percentage);
            this.entryForm.controls['number_of_videos'].setValue(this.paidCourseDetails.number_of_videos);
            this.entryForm.controls['number_of_scripts'].setValue(this.paidCourseDetails.number_of_scripts);
            this.entryForm.controls['number_of_quizzes'].setValue(this.paidCourseDetails.number_of_quizzes);
            this.entryForm.controls['number_of_model_tests'].setValue(this.paidCourseDetails.number_of_model_tests);
            this.entryForm.controls['promo_status'].setValue(this.paidCourseDetails.promo_status);
            this.entryForm.controls['is_active'].setValue(this.paidCourseDetails.is_active);
            this.entryForm.controls['has_trail'].setValue(this.paidCourseDetails.has_trail);
            this.entryForm.controls['is_only_test'].setValue(this.paidCourseDetails.is_only_test);
            this.entryForm.controls['is_cunit'].setValue(this.paidCourseDetails.is_cunit);
            this.entryForm.controls['sort'].setValue(this.paidCourseDetails.sort);
            this.entryForm.controls['appeared_from'].setValue(this.getDateFormatModal(this.paidCourseDetails.appeared_from));
            this.entryForm.controls['appeared_to'].setValue(this.getDateFormatModal(this.paidCourseDetails.appeared_to));

            this.paidCourseDetails.feature_list.forEach(element => {
                this.features.push({name: element.name});
            });

            this.paidCourseDetails.descriptions.forEach(element => {
                    this.description_destais.push(
                    {
                        title: element.title,
                        details: element.details
                    }
                );
            });

            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalLgConfig);
    }

    modalHide() {
        this.modalRef.hide();
        this.entryForm.reset();
        this.submitted = false;
        this.modalTitle = 'Add Paid Course';
        this.btnSaveText = 'Save';
    }

    onSelectIconFile(event) {
        this.iconFiles = [];
        if (event.target.files.length > 0) {
            this.iconFiles = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.uploadIconForm.get('icon_file').setValue(this.iconFiles);
            }
        }
    }

    onSelectThumbnailFile(event) {
        this.thumbnailFiles = [];
        if (event.target.files.length > 0) {
            this.thumbnailFiles = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.uploadThumbnailForm.get('thumbnail_file').setValue(this.thumbnailFiles);
            }
        }
    }

    onSelectSchedulelFile(event) {
        this.schesuleFiles = [];
        if (event.target.files.length > 0) {
            this.schesuleFiles = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.uploadScheduleForm.get('paid_course_schedule').setValue(this.schesuleFiles);
            }
        }
    }

    onSelectSolvedClassFile(event) {
        this.solvedClassFiles = [];
        if (event.target.files.length > 0) {
            this.solvedClassFiles = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.uploadScheduleForm.get('paid_course_solved').setValue(this.solvedClassFiles);
            }
        }
    }

    addFeature(){
        if(this.featuresForm.value.name){
            this.features.push(this.featuresForm.value);
        }
        this.featuresForm.reset();
    }

    removeFeatureItem(index, item){
        this.features.splice(index, 1);
    }

    addDescription(){
        if(this.descriptionDetailsForm.value.title){
            this.description_destais.push(
                {
                    title: this.descriptionDetailsForm.value.title,
                    details: this.descriptionDetailsForm.value.details.split("||")
                }
            );
        }
        this.descriptionDetailsForm.reset();
    }

    removeDescriptionItem(index, item){
        this.description_destais.splice(index, 1);
    }

    onFormSubmit() 
    {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        const obj = {
            id: this.entryForm.value.id,
            name: this.entryForm.value.name,
            name_bn: this.entryForm.value.name_bn,
            course_type: this.entryForm.value.course_type,
            folder_name: this.entryForm.value.folder_name,
            description: this.entryForm.value.description,
            youtube_url: this.entryForm.value.youtube_url,
            coupon_code: this.entryForm.value.coupon_code,
            regular_amount: this.entryForm.value.regular_amount,
            sales_amount: this.entryForm.value.sales_amount,
            discount_percentage: this.entryForm.value.discount_percentage,
            number_of_videos: this.entryForm.value.number_of_videos,
            number_of_scripts: this.entryForm.value.number_of_scripts,
            number_of_quizzes: this.entryForm.value.number_of_quizzes,
            number_of_model_tests: this.entryForm.value.number_of_model_tests,
            promo_status: this.entryForm.value.promo_status,
            is_active: this.entryForm.value.is_active,
            has_trail: this.entryForm.value.has_trail,
            is_only_test: this.entryForm.value.is_only_test,
            is_cunit: this.entryForm.value.is_cunit,
            sort: this.entryForm.value.sort,
            features: this.features,
            desTitles: this.description_destais,
            appeared_from: this.validateDateTimeFormat(this.entryForm.value.appeared_from),
            appeared_to: this.validateDateTimeFormat(this.entryForm.value.appeared_to)
        };

        var formData = new FormData();
        formData.append("data", JSON.stringify(obj));

        if(this.uploadIconForm.get('icon_file').value){
            let iconThumbnail = this.uploadIconForm.get('icon_file').value;
            formData.append("iconThumbnail", iconThumbnail);
        }else{
            formData.append("iconThumbnail", null);
        }

        if(this.uploadThumbnailForm.get('thumbnail_file').value){
            let thumbnail = this.uploadThumbnailForm.get('thumbnail_file').value;
            formData.append("thumbnail", thumbnail);
        }else{
            formData.append("thumbnail", null);
        }

        if(this.uploadScheduleForm.get('paid_course_schedule').value){
            let studySchedule = this.uploadScheduleForm.get('paid_course_schedule').value;
            formData.append("studySchedule", studySchedule);
        }else{
            formData.append("studySchedule", null);
        }

        if(this.uploadScheduleForm.get('paid_course_solved').value){
            let solvedSchedule = this.uploadScheduleForm.get('paid_course_solved').value;
            formData.append("solvedSchedule", solvedSchedule);
        }else{
            formData.append("solvedSchedule", null);
        }

        //this.toastr.warning("Under Construction", 'Attention!', { timeOut: 2000 });
        
        this.blockUI.start('Updating data. Please wait...');
        
        this._service.post('paid-course/paid-course-update', formData).subscribe(
            data => {
                this.blockUI.stop();
                if(data.status == "OK"){
                    this.toastr.success(data.messages, 'Success!', { timeOut: 2000 });
                    this.backToLocation();
                } else {
                    this.toastr.warning(data.messages, 'Warning!', { timeOut: 2000 });
                }
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
                            this.getPaidCourseDetails();
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

    getClassWiseSubjects() {
        this._service.get('Learner/GetClassWiseSubjects').subscribe(res => {
            if (res.Status === 2) {
                this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
                return;
            }
            else if (res.Status === 1) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }

            res.Data.forEach(academicClass => {
                academicClass.collapsed = true;
                this.classes.push(academicClass);
            });
            this.loadSubjectWiseVideoCharts();
        }, err => {
            this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
    }

    loadSubjectWiseVideoCharts() {
        this.classes.forEach(academicClass => {
            academicClass.Subjects.forEach(element => {
                element.ChartOptions = null;
                this.getLearnerVideoHistory(element);
            });
        });
    }

    GetLearnerListWithPagination() {

        const obj = {
            size: this.page.size,
            pageNumber: this.page.pageNumber,
            searchText: null,
            gender: null,
            schoolId: null,
            classId: null,
            tab: null,
        };
        this._service.get('Learner/GetLearnerListWithPagination', obj).subscribe(res => {
            if (res.Status === 2) {
                this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
                return;
            }
            else if (res.Status === 1) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.learners.list = []
            this.learners.list = res.Data.List;
            this.learners.total = res.Data.TotalRows;
        }, err => {

            this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });

    }

    getLearnerVideoHistory(item: any) {
        this._service.get('Learner/GetVideoSeenDurationCount/' + item.ID).subscribe(res => {
            this.blockUI.stop();
            if (res.Status === 2) {
                this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
                return;
            }
            else if (res.Status === 1) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            let nameArr = [];
            let dataArr = [];
            res.Data.forEach(element => {
                nameArr.push(element.Name);
                const data = {
                    y: element.SeenDurationSec !== null ? Math.floor(element.SeenDurationSec / 3600) : 0,
                    hour: element.SeenDurationSec !== null ? Math.floor(element.SeenDurationSec / 3600) : 0,
                    mint: element.SeenDurationSec !== null ? Math.floor((element.SeenDurationSec % 3600) / 60) : 0,
                    sec: element.SeenDurationSec !== null ? Math.round((element.SeenDurationSec / 3600) % 60) : 0,
                    name: element.Name
                };
                dataArr.push(data);
                // console.log(data)
            });
            item.ChartOptions = {
                chart: {
                    type: "area",
                    scrollablePlotArea: {
                        minWidth: 700,
                        scrollPositionX: 1
                    }
                },
                title: {
                    text: "Video Seen Progress | " + item.Name
                },
                xAxis: {
                    categories: nameArr,
                    labels: {
                        rotation: 90,
                        style: {
                            fontSize: "9px"
                            // fontFamily: 'Verdana, sans-serif'
                        },
                        overflow: 'justify'
                    }
                },

                yAxis: {
                    labels: {
                        format: "{value}"
                    },
                    title: {
                        text: "Duration (hour)"
                    }
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        fillOpacity: 0.5
                    },
                    series: {
                        borderWidth: 0,
                        cursor: "pointer",
                        dataLabels: {
                            enabled: true,
                            format: "{point.hour: .0f} hr {point.mint: .0f} min {point.sec: .0f} sec"
                        }
                    }
                },
                tooltip: {
                    headerFormat:
                        '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat:
                        "<span >{point.name}</span>: <b>{point.hour: .0f} hr {point.mint: .0f} min {point.sec: .0f} sec </b><br/>"
                },

                series: [
                    {
                        name: "Watched Duration",
                        data: dataArr
                    }
                ]
            };
        }, err => {
            this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        }
        );
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
        this.GetLearnerListWithPagination();
        this.getAllCount();
        this.loadSubjectWiseVideoCharts();
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

    backToLocation() {
        this.routeLocation.back();
    }

}
