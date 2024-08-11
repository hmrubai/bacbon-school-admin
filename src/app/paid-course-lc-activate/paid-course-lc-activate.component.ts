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
    selector: 'app-paid-course-lc-activate',
    templateUrl: './paid-course-lc-activate.component.html',
    styleUrls: ['./paid-course-lc-activate.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PaidCourseLCActivateComponent implements OnInit {
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

    modalTitle = 'Mapping Student - Teacher';
    entryForm: FormGroup;
    featuresForm: FormGroup;
    submitted = false;
    btnSaveText = 'Save';

    file: File;
    arrayBuffer: any;
    filelist: any;

    importedData:any;
    dataImported = false;

    loggedInUsers = [];

    teachers = [];
    selectionTest = [];
    selectedMentor = [];
    allMentorList = [];
    paidCourseList = [];
    paidCourseMentorList = [];
    paidCourseStudentList = [];
    allSubjectList = [];
    allMappingList = [];

    mappingList = [];

    callHistory = { list: [], total: 0 };

    registeredUser = 0;
    video = 0;
    doc = 0;
    exam = 0;
    smallTest = 0;
    bigTest = 0;
    itemsPerSlide = 4;

    paid_course_id;

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
            name: [null, [Validators.required, Validators.maxLength(250)]],
            name_bn: [null, [Validators.required, Validators.maxLength(250)]],
            url: [null, [Validators.required, Validators.maxLength(500)]],
            course_id: [null, [Validators.required]],
            subject_id: [null, [Validators.required]],
            is_optional: [false],
            is_active: [true],
            folder_name: [null],
            sort: [0, [Validators.required]]
        });

        this.featuresForm = this.formBuilder.group({
            mentor_id: [null, [Validators.required, Validators.maxLength(500)]],
            student_id: [null, [Validators.required, Validators.maxLength(500)]],
        });

        this.entryForm.controls['paid_course_id'].setValue(this.paid_course_id);

        // this.getAllPaidCourseMentorList();
        this.getAllPaidCourseStudentList();
        // this.getMappingList();
    }

    get ff() {
        return this.featuresForm.controls;
    }

    get f() {
        return this.entryForm.controls;
    }

    getAllPaidCourseSubjectList() {
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('paid-course/subject-list-ByID/' + this.paid_course_id).subscribe(res => {
            this.allSubjectList = res.result;
            //console.log(this.allSubjectList)
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    // lc/paid-course-students

    getMappingList(){
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('lc/mapping-list/' + this.paid_course_id).subscribe(res => {
            this.allMappingList = res.data;
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    getAllTeacherList() {
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('lc/teachers').subscribe(res => {
            this.allMentorList = res.data;
            console.log(this.allMentorList)
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    getAllPaidCourseMentorList() {
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('lc/paid-course-mentors/' + this.paid_course_id).subscribe(res => {
            this.paidCourseMentorList = res.data;
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    getAllPaidCourseStudentList() {
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('lc/paid-course-lc-students/' + this.paid_course_id).subscribe(res => {
            this.paidCourseStudentList = res.data;
            // console.log(this.paidCourseStudentList)
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.messaage || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalLgConfig);
    }

    containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
        return false;
    }

    isObjectExist(items, itemToCheck){
        return items.some(item => (item.student_id === itemToCheck.student_id && item.mentor_id === itemToCheck.mentor_id));
    }

    addToList(){
        console.log(this.featuresForm.value)

        let student = this.findUserById(this.paidCourseStudentList, this.featuresForm.value.student_id);
        let mentor = this.findUserById(this.paidCourseMentorList, this.featuresForm.value.mentor_id);

        let map_data = {
            student_id: student.id,
            student_name: student.name,
            student_mobile_number: student.mobile_number,
            mentor_id: mentor.user_id,
            mentor_name: mentor.name,
            mentor_mobile_number: mentor.mobile_number
        }

        let is_exist = this.isObjectExist(this.mappingList, map_data)
        if (is_exist) 
        {
            this.toastr.warning('Already added into the list!', 'Warning!', { closeButton: true, disableTimeOut: false });
            return;
        }

        this.mappingList.push({
            student_id: student.id,
            student_name: student.name,
            student_mobile_number: student.mobile_number,
            mentor_id: mentor.user_id,
            mentor_name: mentor.name,
            mentor_mobile_number: mentor.mobile_number
        })
    }

    removeMappingList(index){
        this.mappingList.splice(index, 1);
    }

    findUserById(list, id) {
        return list.find(item => item.id === id);
    }

    selectExpert(expert: any){
        console.log(expert);
        let is_exist = this.containsObject(expert, this.selectedMentor);
        if (is_exist) 
        {
            this.toastr.warning('Already added into the list!', 'Warning!', { closeButton: true, disableTimeOut: false });
            return;
        }
        this.selectedMentor.push(expert);
    }

    addMentor(){
        if(this.featuresForm.value.name){
            this.selectedMentor.push(this.featuresForm.value);
        }
        this.featuresForm.reset();
    }

    removeMentorList(index, item){
        this.selectedMentor.splice(index, 1);
    }

    onMappingSubmit(){
        if (this.mappingList.length <= 0){
            this.toastr.warning('Please add mapping data!', 'Warning!', { closeButton: true, disableTimeOut: false });
            return;
        }

        const params = {
            paid_course_id: this.entryForm.value.paid_course_id,
            map_data: this.mappingList
        }

        this.blockUI.start('Saving data. Please wait...');

        this._service.post('lc/add-mapping', params).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.selectedMentor = [];
                this.getMappingList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    onSelectedMentorSubmit() {
        console.log(this.selectedMentor);

        if (this.selectedMentor.length <= 0){
            this.toastr.warning('Please select mentor!', 'Warning!', { closeButton: true, disableTimeOut: false });
            return;
        }

        const params = {
            paid_course_id: this.entryForm.value.paid_course_id,
            mentors: this.selectedMentor
        }

        this.blockUI.start('Saving data. Please wait...');

        this._service.post('lc/assign-teacher', params).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.selectedMentor = [];
                this.getAllPaidCourseMentorList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    clickToActivateLC(item) {
        console.log(item)

        this.confirmService.confirm('Are you sure?', 'Do you want to Activate LC?.', "Yes, Activate LC")
        .subscribe(
            result => {
                if (result) {
                    this._service.post('lc/activate', { id : item.participant_id }).subscribe(
                        data => {
                            this.blockUI.stop();
                            this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                            this.getAllPaidCourseStudentList();
                        },
                        err => {
                            this.blockUI.stop();
                            this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                        }
                    );
                }
            });
    }

    clickToDeActivateLC(item) {
        console.log(item)

        this.confirmService.confirm('Are you sure?', 'Do you want to deactivate LC?.', "Yes, deactive LC")
        .subscribe(
            result => {
                if (result) {
                    this._service.post('lc/deactive', { id : item.participant_id }).subscribe(
                        data => {
                            this.blockUI.stop();
                            this.toastr.warning(data.messages, 'Success', { timeOut: 2000 });
                            this.getAllPaidCourseStudentList();
                        },
                        err => {
                            this.blockUI.stop();
                            this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                        }
                    );
                }
            });
    }

    deleteMapping(item){
        this.confirmService.confirm('Are you sure?', 'Do you want to delete?.', "Yes, delete")
        .subscribe(
            result => {
                if (result) {
                    this._service.post('lc/remove-mapping', { id : item.id }).subscribe(
                        data => {
                            this.blockUI.stop();
                            this.toastr.warning(data.messages, 'Success', { timeOut: 2000 });
                            this.getMappingList();
                        },
                        err => {
                            this.blockUI.stop();
                            this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                        }
                    );
                }
            });
    }
    

    editSelectionTest(item, template: TemplateRef<any>){
        this.modalTitle = 'Update Paid Course Subject';
        this.btnSaveText = 'Update';
        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['paid_course_id'].setValue(item.paid_course_id);
        this.entryForm.controls['name'].setValue(item.name);
        this.entryForm.controls['name_bn'].setValue(item.name_bn);
        this.entryForm.controls['url'].setValue(item.url);
        this.entryForm.controls['course_id'].setValue(item.course_id);
        this.entryForm.controls['subject_id'].setValue(item.subject_id);
        this.entryForm.controls['is_optional'].setValue(item.is_optional);
        this.entryForm.controls['is_active'].setValue(item.is_active);
        this.entryForm.controls['folder_name'].setValue(item.folder_name);
        this.entryForm.controls['sort'].setValue(item.sort);

        this.openModal(template);
    }

    modalHide() {
        this.modalRef.hide();
        this.entryForm.reset();
        this.submitted = false;
        this.entryForm.controls['paid_course_id'].setValue(this.paid_course_id);
        this.importedData = [];
        this.modalTitle = 'Add Paid Course Subject';
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

        console.log(this.entryForm.invalid);

        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Saving data. Please wait...');
        const obj = {
            id: this.entryForm.value.id,
            paid_course_id: this.entryForm.value.paid_course_id,
            name: this.entryForm.value.name,
            name_bn: this.entryForm.value.name_bn,
            url: this.entryForm.value.url,
            folder_name: this.entryForm.value.folder_name,
            sort: this.entryForm.value.sort,
            course_id: this.entryForm.value.course_id,
            subject_id: this.entryForm.value.subject_id,
            is_optional: this.entryForm.value.is_optional,
            is_active: this.entryForm.value.is_active
        };

        this._service.post('paid-course/add-update-subject', obj).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getAllPaidCourseSubjectList();
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
                            this.getAllPaidCourseSubjectList();
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
