import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../_services/common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
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
    selector: 'app-add-paid-course',
    templateUrl: './add-paid-course.component.html',
    styleUrls: ['./add-paid-course.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddPaidCourseComponent implements OnInit {
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
            name: [null, [Validators.required, Validators.maxLength(250)]],
            name_bn: [null, [Validators.required, Validators.maxLength(250)]],
            course_type: ['universityAdmissionCourse', [Validators.required]],
            folder_name: [''],
            description: [''],
            youtube_url: [null],
            thumbnail: [null, [Validators.required, Validators.maxLength(250)]],
            paid_course_icon: [null, [Validators.required, Validators.maxLength(250)]],
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
            is_cunit: [false],
            is_active: [true],
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

        //this.getAllSelectionTestList();

    }

    get f() {
        return this.entryForm.controls;
    }

    getAllSelectionTestList() {
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('getAllSelectionTestList').subscribe(res => {
            this.selectionTest = res.result;
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
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
            is_cunit: this.entryForm.value.is_cunit,
            is_only_test: this.entryForm.value.is_only_test,
            sort: this.entryForm.value.sort,
            features: this.features,
            desTitles: this.description_destais,
            appeared_from: this.validateDateTimeFormat(this.entryForm.value.appeared_from),
            appeared_to: this.validateDateTimeFormat(this.entryForm.value.appeared_to)
        };

        let iconThumbnail = this.uploadIconForm.get('icon_file').value;
        let thumbnail = this.uploadThumbnailForm.get('thumbnail_file').value;
        //let studySchedule = this.uploadScheduleForm.get('paid_course_schedule').value;

        var formData = new FormData();
        formData.append("data", JSON.stringify(obj));
        formData.append("iconThumbnail", iconThumbnail);
        formData.append("thumbnail", thumbnail);
        

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

        this.blockUI.start('Saving data. Please wait...');
        
        this._service.post('paid-course/create-paid-course', formData).subscribe(
            data => {
                this.blockUI.stop();
                if(data.status == "OK"){
                    this.toastr.success(data.messages, 'Success!', { timeOut: 2000 });
                    this.backToLocation();
                } else {
                    this.toastr.warning(data.messages, 'Warning!', { timeOut: 2000 });
                }
                // this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                // this.backToLocation();
                //this.modalHide();
                //this.getAllSelectionTestList();
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
                            this.getAllSelectionTestList();
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

    getGenderList() {
        this._service.get('Learner/GetGenderCount').subscribe(res => {
            if (res.Status === 2) {
                this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
                return;
            }
            else if (res.Status === 1) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.gender.list = [];
            res.Data.forEach(element => {
                this.gender.list.push({
                    name: element.Name + " (" + element.Count + ")",
                    y: Number(element.Count),
                })

            });
            this.gender.total = res.length;

            //  this.gender.list = res;

            //  this.gender.total = res.Total;

            this.genderChartOptions = {
                chart: {
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'

                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true
                        },

                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Gender',
                    data: this.gender.list

                }]
            };
        }, err => {
            this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        }
        );
    }

    getAgeList() {
        this._service.get('Learner/GetAgeRatio').subscribe(res => {
            if (res.Status === 2) {
                this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
                return;
            }
            else if (res.Status === 1) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.age.list = [];
            res.Data.forEach(element => {
                this.age.list.push({
                    name: element.AgeRange + " (" + element.Count + ")",
                    y: Number(element.Count),
                })

            });

            this.age.total = this.age.list.length;

            this.ageChartOptions = {
                chart: {
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'

                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true
                        },

                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Age Range',
                    data: this.age.list

                }]
            };
        }, err => {
            this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        }
        );
    }

    getSchoolWiseLearnerList() {
        this._service.get('Learner/GetSchoolWiseLearnerRatio').subscribe(res => {
            if (res.Status === 2) {
                this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
                return;
            }
            else if (res.Status === 1) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.school.list = [];
            res.Data.forEach(element => {
                this.school.list.push({
                    name: element.Name + "(" + element.Count + ")",
                    y: Number(element.Count),
                })

            });

            this.school.total = this.school.list.length;

            this.schoolChartOptions = {
                chart: {
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'

                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true
                        },

                        showInLegend: false
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Learners ',
                    data: this.school.list

                }]
            };
        }, err => {
            this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        }
        );
    }

    GetClassWiseLearnerCount() {
        this._service.get('Learner/GetClassWiseLearnerCount').subscribe(res => {
            if (res.Status === 2) {
                this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
                return;
            }
            else if (res.Status === 1) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.academicClass.list = []
            res.Data.forEach(element => {
                this.academicClass.list.push({
                    name: element.ClassName_en + " (" + element.Count + ")",
                    y: Number(element.Count),
                })

            });

            this.academicClass.total = res.length;

            this.classChartOptions = {
                chart: {
                    plotBorderWidth: null,
                    plotShadow: false
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'

                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true
                        },

                        showInLegend: true
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Class',
                    data: this.academicClass.list

                }]
            };
        }, err => {
            this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        }
        );
    }

    GetLearnerLocationRatio() {
        this._service.get('Learner/GetLearnerLocationRatio').subscribe(res => {
            if (res.Status === 2) {
                this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
                return;
            }
            else if (res.Status === 1) {
                this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
                return;
            }
            this.location = []
            res.Data.forEach(element => {
                var data = [];

                element.Location.forEach(a => {

                    data.push({
                        name: a.LocationName,
                        y: Number(a.Count),

                    })

                });
                this.location.push({
                    className: element.ClassName,
                    //chartData: data,
                    locationOptions: {
                        chart: {
                            type: 'column',
                            marginRight: 10,

                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            categories: data.map(x => x.name),

                            title: {
                                text: 'Areas'
                            },
                            labels: {
                                rotation: -45,
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif'
                                }
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Learners from the area'
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        tooltip: {
                            pointFormat: 'Learner(s): <b>{point.y} </b>'
                        },
                        series: [{
                            name: 'Area',
                            data: data,
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                align: 'top',
                                format: '{point.y}', // one decimal
                                y: 0, // 10 pixels down from the top
                                style: {
                                    fontSize: '13px',
                                    fontFamily: 'Verdana, sans-serif'
                                }
                            }
                        }]
                    }
                });
            });



        }, err => {
            this.toastr.warning(err.Messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        }
        );
    }

    refreshComponent() {
        this.GetLearnerListWithPagination();
        this.getAllCount();
        this.getGenderList();
        this.getAgeList();
        this.GetClassWiseLearnerCount();
        this.GetLearnerLocationRatio();
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
