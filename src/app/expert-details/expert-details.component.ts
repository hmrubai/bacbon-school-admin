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
declare var $: any;
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-expert-details',
    templateUrl: './expert-details.component.html',
    styleUrls: ['./expert-details.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ExpertDetailsComponent implements OnInit {
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

    file: File;
    arrayBuffer: any;
    filelist: any;

    importedData:any;
    dataImported = false;

    modalTitle = 'Add New Teacher';
    entryForm: FormGroup;
    uploadMCQForm: FormGroup;
    submitted = false;
    btnSaveText = 'Save';

    loggedInUsers = [];

    selectionTest = [];

    uploadableExport = [];

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
            email: [null, [Validators.maxLength(250)]],
            image: [null, [Validators.maxLength(250)]],
            institute: [null, [Validators.maxLength(250)]],
            experiance: [null, [Validators.maxLength(250)]],
            mobile_number: [null, [Validators.required, Validators.maxLength(250)]],
            bio: [null, [Validators.maxLength(250)]],
        });

        this.uploadMCQForm = this.formBuilder.group({
            question_set_id: [1, [Validators.required]],
            subject: [null, [Validators.required, Validators.maxLength(250)]],
        });

        this.getAllTeacherList();

    }

    get f() {
        return this.entryForm.controls;
    }

    get uMCQf() {
        return this.uploadMCQForm.controls;
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

    getAllTeacherList() {
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('lc/teachers').subscribe(res => {
            this.selectionTest = res.data;
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
        this.modalTitle = 'Update Information';
        this.btnSaveText = 'Update';
        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['name'].setValue(item.name);
        this.entryForm.controls['email'].setValue(item.email);
        this.entryForm.controls['institute'].setValue(item.institute);
        this.entryForm.controls['experiance'].setValue(item.experiance);
        this.entryForm.controls['mobile_number'].setValue(item.mobile_number);
        this.entryForm.controls['bio'].setValue(item.bio);
        this.openModal(template);
    }

    editTeacher(item, template: TemplateRef<any>){
        console.log(item)
        this.modalTitle = 'Update Information';
        this.btnSaveText = 'Update';
        this.entryForm.controls['id'].setValue(item.id);
        this.entryForm.controls['name'].setValue(item.name);
        this.entryForm.controls['email'].setValue(item.email);
        this.entryForm.controls['institute'].setValue(item.institute);
        this.entryForm.controls['experiance'].setValue(item.experiance);
        this.entryForm.controls['mobile_number'].setValue(item.mobile_number);
        this.entryForm.controls['bio'].setValue(item.bio);
        this.openModal(template);
    }

    modalHide() {
        this.modalRef.hide();
        this.entryForm.reset();
        this.submitted = false;
        this.modalTitle = 'Add Teacher';
        this.btnSaveText = 'Save';

        this.uploadableExport = [];
    }

    onExpertUploadFormSubmit(){
        let param = {
            teacher: this.uploadableExport
        }

        this.blockUI.start('Saving data. Please wait...');
        this._service.post('lc/upload-teacher-excel', param).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getAllTeacherList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    onFormSubmit() {
        this.submitted = true;
        if (this.entryForm.invalid) {
            return;
        }

        this.blockUI.start('Saving data. Please wait...');
        const obj = {
            id: this.entryForm.value.id,
            name: this.entryForm.value.name,
            email: this.entryForm.value.email,
            mobile_number: this.entryForm.value.mobile_number,
            institute: this.entryForm.value.institute,
            experiance: this.entryForm.value.experiance,
            bio: this.entryForm.value.bio,
        };

        this._service.post('lc/add-update-teacher', obj).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getAllTeacherList();
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
            this.uploadableExport = this.importedData;
        }
    }

    removeFromExpertList(index){
        this.uploadableExport.splice(index, 1);
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
