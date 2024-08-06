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
    selector: 'app-subject-list-paid-course-meterials',
    templateUrl: './subject-list-paid-course-meterials.component.html',
    styleUrls: ['./subject-list-paid-course-meterials.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SubjectListPaidCourseMeterialsComponent implements OnInit {
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

    modalTitle = 'Add Subject';
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
    allSubjectList = [];
    optionalSubjectList = [];
    coreSubjectList = [];

    submitSubjectList = [];

    meterialDetails;
    meterial_total_number_of_question = 0;

    callHistory = { list: [], total: 0 };

    registeredUser = 0;
    video = 0;
    doc = 0;
    exam = 0;
    smallTest = 0;
    bigTest = 0;
    itemsPerSlide = 4;
    is_optional_exist = false;

    paid_course_test_id;

    rows = [];
    classes = [];

    testType = [
        {
            id: 'RevisionTest',
            name: 'Revision Test'
        },
        {
            id: 'ModelTest',
            name: 'Model Test'
        },
        {
            id: 'WeeklyTest',
            name: 'Weekly Test'
        }
    ]

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
        this.paid_course_test_id = this.route.snapshot.paramMap.get("paid_course_test_id");
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
            subject_id: [null, [Validators.required, Validators.maxLength(250)]],
            name: [null, [Validators.required, Validators.maxLength(250)]],
            number_of_questions: [null, [Validators.required, Validators.maxLength(250)]],
        });

        this.getAllSubjectList();
        this.getCoreSubjectList();
        this.getMeterialDetails();
    }

    get f() {
        return this.entryForm.controls;
    }

    getAllSubjectList() {
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('paid-course-meterials-subject-list/' + this.paid_course_test_id).subscribe(res => {
            this.allSubjectList = res.result;

            // this.allSubjectList.forEach(element => {
            //     this.submitSubjectList.push({
            //         id: element.id,
            //         name: element.name,
            //         number_of_questions: element.number_of_questions,
            //         optional_subject_id: element.optional_subject_id,
            //         is_optional: element.is_optional
            //     });
            // });

            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    getCoreSubjectList(){
        this._service.get('get-core-subject-list').subscribe(res => {
            this.coreSubjectList = res.result;
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
    }

    getOptionalSubjectList(){
        this._service.get('get-optional-subject-list').subscribe(res => {
            this.optionalSubjectList = res.result;
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
    }

    getMeterialDetails(){
        this._service.get('getPaidCourseTestDetailsByID/' + this.paid_course_test_id).subscribe(res => {
            this.meterialDetails = res.result;
            this.meterial_total_number_of_question = this.meterialDetails.quiz_question_number;
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
    }

    addSubject(){
        if(!this.entryForm.value.number_of_questions || !this.entryForm.value.subject_id){
            this.toastr.warning('Please, Check the details!', 'Warning!', { closeButton: true, disableTimeOut: false });
            return;
        }
        
        let subject;
        this.coreSubjectList.forEach(element => {
            if(this.entryForm.value.subject_id == element.id){
                //console.log(element)
                subject = element;
            }
        });

        let list_number_of_question = 0;
;
        let is_exist = false;
        let is_optional_exist = false;
        this.submitSubjectList.forEach(element => {
            if(element.id == subject.id){
                is_exist = true; 
            }

            if(element.name == subject.name){
                is_exist = true; 
            }

            if(element.is_optional){
                is_optional_exist = true;
            }

            list_number_of_question = list_number_of_question + element.number_of_questions;
        });

        this.allSubjectList.forEach(item => {

            if(item.id == subject.id){
                is_exist = true; 
            }

            if(item.name == subject.name){
                is_exist = true; 
            }

            if(item.is_optional){
                is_optional_exist = true;
            }

            list_number_of_question = list_number_of_question + item.number_of_questions;
        });

        list_number_of_question = list_number_of_question + this.entryForm.value.number_of_questions;

        if(is_exist){
            this.toastr.warning('Subject Already exist', 'Warning!', { closeButton: true, disableTimeOut: false });
            return;
        }

        if(subject.optional_subject_id && is_optional_exist){
            this.toastr.warning('You can not add multiple optional subject!', 'Warning!', { closeButton: true, disableTimeOut: false });
            return;
        }

        if(this.meterial_total_number_of_question < list_number_of_question){
            this.toastr.warning('Total number of question limit is exceeded!', 'Warning!', { closeButton: true, disableTimeOut: false });
            return;
        }

        let is_optional = false;
        if(subject.optional_subject_id){
            is_optional = true;
        }

        this.submitSubjectList.push({
            id: subject.id,
            name: subject.name,
            number_of_questions: this.entryForm.value.number_of_questions,
            optional_subject_id: subject.optional_subject_id,
            is_optional: is_optional
        });
    }

    deleteSubjectFromList(index){
        this.submitSubjectList.splice(index, 1);
    }


    saveSubjectList(){
        console.log(this.submitSubjectList);

        if(!this.submitSubjectList.length){
            this.toastr.warning('Please, add subjects!', 'Attention!', { closeButton: true, disableTimeOut: false });
            return;
        }
        
        let params = {
            paid_course_material_id: this.paid_course_test_id,
            subjects: this.submitSubjectList
        }

        this._service.post('paid-course-meterials/add-bulk-subject', params).subscribe(
            data => {
                if(data.status == 'OK'){
                    this.blockUI.stop();
                    this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                    this.modalHide();
                    this.submitSubjectList = [];
                    this.getAllSubjectList();
                }else{
                    this.blockUI.stop();
                    this.toastr.warning(data.messages, 'Attention!', { closeButton: true, disableTimeOut: false });
                }
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );

    }

    deleteSubjectFromDB(item){
        this.confirmService.confirm('Are you sure?', 'Do you want to delete?.', "Yes, delete")
        .subscribe(
            result => {
                if (result) {
                    this._service.post('paid-course-meterials/delete-subject', { id : item.id }).subscribe(
                        data => {
                            if(data.status == 'OK'){
                                this.blockUI.stop();
                                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                                this.getAllSubjectList();
                            }else{
                                this.toastr.warning(data.messages, 'Attention!', { closeButton: true, disableTimeOut: false });
                            }
                        },
                        err => {
                            this.blockUI.stop();
                            this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                        }
                    );
                }
            });
    }


    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalLgConfig);
    }

    ChangeOptional(isOptional){
        //console.log(isOptional)
        if(isOptional){
            this.is_optional_exist = true;
        }else{
            this.is_optional_exist = false;
            this.entryForm.controls['optional_subject_id'].setValue(null);
        }
    }

    editMeterialSubject(item, template: TemplateRef<any>){
        this.modalTitle = 'Update Subject';
        this.btnSaveText = 'Update';
        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['paid_course_material_id'].setValue(item.paid_course_material_id);
        this.entryForm.controls['name'].setValue(item.name);
        this.entryForm.controls['number_of_questions'].setValue(item.number_of_questions);
        this.entryForm.controls['is_active'].setValue(item.is_active);
        this.entryForm.controls['is_optional'].setValue(item.is_optional);
        this.entryForm.controls['optional_subject_id'].setValue(item.optional_subject_id);
        if(item.is_optional){
            this.is_optional_exist = true;
        }

        this.openModal(template);
    }

    modalHide() {
        this.modalRef.hide();
        this.entryForm.reset();
        this.submitted = false;
        // this.entryForm.controls['paid_course_material_id'].setValue(this.paid_course_test_id);
        // this.entryForm.controls['is_active'].setValue(true);
        // this.entryForm.controls['is_optional'].setValue(false);
        // this.is_optional_exist = false;
        this.importedData = [];
        this.modalTitle = 'Add Subject';
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

    onUrlPasteEvent(event: any){
        let url_data = event.target.value.split("/");
        if(url_data.length){
            let subject_id = url_data[url_data.length - 1];
            let course_id = url_data[url_data.length - 2];
            if(!subject_id || !course_id){
                this.toastr.warning('Please, Enter valid URL!', 'Warning!', { closeButton: true, disableTimeOut: false });
                return;
            }
            this.entryForm.controls['course_id'].setValue(parseInt(course_id));
            this.entryForm.controls['subject_id'].setValue(parseInt(subject_id));
        }
    }

    onFormSubmit() {
        this.submitted = true;

        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Saving data. Please wait...');
        const obj = {
            id: this.entryForm.value.id,
            paid_course_material_id: this.entryForm.value.paid_course_material_id,
            name: this.entryForm.value.name,
            number_of_questions: this.entryForm.value.number_of_questions,
            is_active: this.entryForm.value.is_active,
            is_optional: this.entryForm.value.is_optional,
            optional_subject_id: this.entryForm.value.optional_subject_id,
        };

        this._service.post('paid-course-meterials/add-update-subject', obj).subscribe(
            data => {
                if(data.status == 'OK'){
                    this.blockUI.stop();
                    this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                    this.modalHide();
                    this.getAllSubjectList();
                }else{
                    this.blockUI.stop();
                    this.toastr.warning(data.messages, 'Attention!', { closeButton: true, disableTimeOut: false });
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
                            this.getAllSubjectList();
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

    backToLocation(){
        this.routerLocation.back();
    }

}
