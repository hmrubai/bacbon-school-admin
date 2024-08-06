import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ConfirmService } from 'src/app/_helpers/confirm-dialog/confirm.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Page } from '../_models/page';
import { CommonService } from '../_services/common.service';
import { debounceTime } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-paid-course-test-questions',
    templateUrl: './paid-course-test-questions.component.html',
    styleUrls: ['./paid-course-test-questions.component.scss']
})
export class PaidCourseTestQuestionsComponent implements OnInit {

    id: string;
    isEdit: boolean;
    ColumnMode = ColumnMode;
    isCollapsed: boolean = true;
    modalTitle = 'Add Learner';
    entryForm: FormGroup;
    submitted = false;
    @BlockUI() blockUI: NgBlockUI;
    btnSaveText = 'Save';
    loadingIndicator = false;
    filterForm: FormGroup;
    questionForm: FormGroup;
    rqForm: FormGroup;
    uploadForm: FormGroup;
    uploadMCQForm: FormGroup;

    is_loaded = false;

    page = new Page();
    rows = [];
    filteredData = [];

    paid_course_test_id;
    paidCourseTest;


    file: File;
    arrayBuffer: any;
    filelist: any;

    importedData:any;
    dataImported = false;

    schoolList: Array<any> = [];
    classList: Array<any> = [];
    questionList: Array<any> = [];
    writtenQuestionList: Array<any> = [];
    subjectList: Array<any> = [];
    setList: Array<any> = [];

    questionDetails: any;

    urls = [];
    files = [];

    genderList = ["Male", "Female", "Others"];
    questionType = [
        {
            id: "Short",
            name: "Short"
        },
        {
            id: "Descriptive",
            name: "Descriptive"
        },
        {
            id: "Paragraph",
            name: "Paragraph"
        }
    ]
    selectedGender: any;

    modalLgConfig: any = { class: 'gray modal-lg', backdrop: 'static' };
    modalSmConfig: any = { class: 'gray modal-md', backdrop: 'static' };
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
        private location: Location,
        private confirmService: ConfirmService
    ) {

        this.page.pageNumber = 0;
        this.page.size = 500;
        this.paid_course_test_id = this.route.snapshot.paramMap.get("paid_course_test_id");
    }

    ngOnInit() {
        this.filterForm = this.formBuilder.group({
            query: [null],
            gender: [null],
            tab: [null],
            class: [null],
            school: [null],
        });

        this.questionForm = this.formBuilder.group({
            id: [null],
            question: [null, [Validators.maxLength(250)]],
            question_image: [null, [Validators.maxLength(250)]],
            option1: [null, [Validators.maxLength(250)]],
            option1_image: [null, [Validators.maxLength(250)]],
            option2: [null, [Validators.maxLength(250)]],
            option2_image: [null, [Validators.maxLength(250)]],
            option3: [null, [Validators.maxLength(250)]],
            option3_image: [null, [Validators.maxLength(250)]],
            option4: [null, [Validators.maxLength(250)]],
            option4_image: [null, [Validators.maxLength(250)]],
            option5: [null],
            option5_image: [null],
            option6: [null],
            option6_image: [null],
            correct_answer: [false],
            correct_answer2: [false],
            correct_answer3: [false],
            correct_answer4: [false],
            correct_answer5: [false],
            correct_answer6: [false],
            explanation_text: [null],
            explanation: [null],
        });

        this.rqForm = this.formBuilder.group({
            id: [null],
            paid_course_material_id: this.paid_course_test_id,
            question: [null, [Validators.required, Validators.maxLength(250)]],
            mark: [1, [Validators.required, Validators.maxLength(250)]],
            question_type: ["Short", [Validators.required, Validators.maxLength(250)]],
            explanation_text: [null],
        });

        this.uploadMCQForm = this.formBuilder.group({
            question_set_id: [1, [Validators.required]],
            subject: [null, [Validators.required, Validators.maxLength(250)]],
        });
        
        this.uploadForm = this.formBuilder.group({
            attachment: [''],
            total_marks: [null, [Validators.required, Validators.maxLength(250)]],
            no_of_questions: [null, [Validators.required, Validators.maxLength(250)]],
        });

        if(this.paid_course_test_id){
            this.getQuestionList();
            this.getPaidCourseTestDetails();
            this.getSubjectList();
            this.getSetList();
        }
    }

    get f() {
        return this.questionForm.controls;
    }

    get uf() {
        return this.uploadForm.controls;
    }

    get uMCQf() {
        return this.uploadMCQForm.controls;
    }

    get rf() {
        return this.rqForm.controls;
    }

    setPage(pageInfo) {
        this.page.pageNumber = pageInfo.offset;
        this.getQuestionList(); 
    }

    getQuestionList(){
        this.blockUI.start('Getting data. Please wait...');
        this._service.get('getPaidCourseTestAllQuestionListByID/' + this.paid_course_test_id).subscribe(res => {
            this.questionList = res.result.mcq;
            this.writtenQuestionList = res.result.written;
            this.page.totalElements = res.result.mcq.length;
            this.page.totalPages = Math.ceil(this.page.totalElements / this.page.size);
            this.blockUI.stop();
        }, err => {
            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            this.blockUI.stop();
        });
    }

    getSubjectList(){
        this._service.get('paid-course-meterials-subject-list/' + this.paid_course_test_id).subscribe(res => {
            this.subjectList = res.result;
        }, err => {
            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
    }

    getSetList(){
        this._service.get('question-sets').subscribe(res => {
            this.setList = res.result;
        }, err => {
            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
    }

    getPaidCourseTestDetails(){
        this._service.get('getPaidCourseTestDetailsByID/' + this.paid_course_test_id).subscribe(res => {
            this.paidCourseTest = res.result;
            this.is_loaded = true;
        }, err => {
            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
    }

    deleteQuestionImage(id, option){
        let param = { id : id, option:  option };
        this.modalHide();
        this.confirmService.confirm('Are you sure?', 'Do you want to delete?.', "Yes, delete")
        .subscribe(
            result => {
                if (result) {
                    this._service.post('deleteCourseTestQuestionImage', param).subscribe(
                        data => {
                            this.blockUI.stop();
                            this.toastr.success(data.message, 'Success', { timeOut: 2000 });
                            this.getQuestionList();
                        },
                        err => {
                            this.blockUI.stop();
                            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                        }
                    );
                }
            });
    }

    deleteQuestion(item){
        this.confirmService.confirm('Are you sure?', 'Do you want to delete?.', "Yes, delete")
        .subscribe(
            result => {
                if (result) {
                    this._service.post('deleteCourseTestQuestion', { id : item.id }).subscribe(
                        data => {
                            this.blockUI.stop();
                            this.toastr.success(data.message, 'Success', { timeOut: 2000 });
                            this.getQuestionList();
                        },
                        err => {
                            this.blockUI.stop();
                            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
                        }
                    );
                }
            });
    }

    onSelectFile(event) {
        this.urls = [];
        this.files = [];

        if (event.target.files.length > 0) {
            this.files = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.uploadForm.get('attachment').setValue(this.files);
                //this.submitImage();
            }
        }
    }

    onSelectQuestionFile(event) {
        this.urls = [];
        this.files = [];

        if (event.target.files.length > 0) {
            this.files = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.questionForm.get('question_image').setValue(this.files);
            }
        }
    }

    onSelectOption1File(event) {
        this.urls = [];
        this.files = [];

        if (event.target.files.length > 0) {
            this.files = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.questionForm.get('option1_image').setValue(this.files);
            }
        }
    }

    onSelectOption2File(event) {
        this.urls = [];
        this.files = [];

        if (event.target.files.length > 0) {
            this.files = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.questionForm.get('option2_image').setValue(this.files);
            }
        }
    }

    onSelectOption3File(event) {
        this.urls = [];
        this.files = [];

        if (event.target.files.length > 0) {
            this.files = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.questionForm.get('option3_image').setValue(this.files);
            }
        }
    }

    onSelectOption4File(event) {
        this.urls = [];
        this.files = [];

        if (event.target.files.length > 0) {
            this.files = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.questionForm.get('option4_image').setValue(this.files);
            }
        }
    }

    onSelectOption5File(event) {
        this.urls = [];
        this.files = [];

        if (event.target.files.length > 0) {
            this.files = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.questionForm.get('option5_image').setValue(this.files);
            }
        }
    }

    onSelectOption6File(event) {
        this.urls = [];
        this.files = [];

        if (event.target.files.length > 0) {
            this.files = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.questionForm.get('option6_image').setValue(this.files);
            }
        }
    }

    onSelectExplanationFile(event) {
        this.urls = [];
        this.files = [];

        if (event.target.files.length > 0) {
            this.files = event.target.files[0];
            if (event.target.files[0].size > 2000000){
                this.toastr.error('File size is more then 2MB', 'Failed to changed!', { timeOut: 3000 });
                return;
            }else{
                this.questionForm.get('explanation').setValue(this.files);
            }
        }
    }

    submitAttachment() 
    {
        const formData = new FormData();
        formData.append('paid_course_material_id', this.paid_course_test_id);
        formData.append('total_marks', this.uploadForm.value.total_marks);
        formData.append('no_of_questions', this.uploadForm.value.no_of_questions);
        formData.append('attachment', this.uploadForm.get('attachment').value);

        this.blockUI.start('Uploading File...');
        this._service.post('paid-course/attachment-upload', formData).subscribe(
            res => {
                this.blockUI.stop();
                if (!res.status) {
                    this.toastr.error(res.message, 'Error!', { closeButton: true, disableTimeOut: true, enableHtml: true });
                    return;
                }
                this.modalHide();
                this.getQuestionList();
                this.toastr.success(res.message, 'Success!', { timeOut: 3000 });
                this.urls = [];
                this.files = [];
            },
            err => {
                this.blockUI.stop();
                this.toastr.error(err.message || err, 'Error!', { closeButton: true, disableTimeOut: true, enableHtml: true });
            }
        );
    }

    modalHide() {
        this.rqForm.reset();
        this.questionForm.reset();
        this.uploadForm.reset();
        this.modalRef.hide();
        this.submitted = false;
        this.modalTitle = 'Upload Questions using XLSX';
        this.btnSaveText = 'Upload';
    }

    editQuestion(item, template: TemplateRef<any>){
        this.modalTitle = 'Update Questions';
        this.btnSaveText = 'Update';
        this.questionForm.controls['id'].setValue(item.id);
        this.questionForm.controls['question'].setValue(item.question);
        this.questionForm.controls['question_image'].setValue(item.question_image);
        this.questionForm.controls['option1'].setValue(item.option1);
        this.questionForm.controls['option2'].setValue(item.option2);
        this.questionForm.controls['option3'].setValue(item.option3);
        this.questionForm.controls['option4'].setValue(item.option4);
        this.questionForm.controls['option5'].setValue(item.option5);
        this.questionForm.controls['option6'].setValue(item.option6);
        this.questionForm.controls['correct_answer'].setValue(item.correct_answer ? true : false);
        this.questionForm.controls['correct_answer2'].setValue(item.correct_answer2 ? true : false);
        this.questionForm.controls['correct_answer3'].setValue(item.correct_answer3 ? true : false);
        this.questionForm.controls['correct_answer4'].setValue(item.correct_answer4 ? true : false);
        this.questionForm.controls['correct_answer5'].setValue(item.correct_answer5 ? true : false);
        this.questionForm.controls['correct_answer6'].setValue(item.correct_answer6 ? true : false);
        this.questionForm.controls['explanation_text'].setValue(item.explanation_text);
        this.questionForm.controls['option1_image'].setValue(item.option1_image);
        this.questionForm.controls['option1_image'].setValue(item.option1_image);
        this.questionForm.controls['option2_image'].setValue(item.option2_image);
        this.questionForm.controls['option3_image'].setValue(item.option3_image);
        this.questionForm.controls['option4_image'].setValue(item.option4_image);
        this.questionForm.controls['option5_image'].setValue(item.option5_image);
        this.questionForm.controls['option6_image'].setValue(item.option6_image);
        this.questionForm.controls['explanation'].setValue(item.explanation);

        this.questionDetails = item;

        console.log(this.questionDetails)

        this.openEditModal(template);
    }

    editWrittenQuestion(item, template: TemplateRef<any>){
        this.modalTitle = 'Update Questions';
        this.btnSaveText = 'Update';
        this.rqForm.controls['id'].setValue(item.id);
        this.rqForm.controls['question'].setValue(item.question);
        this.rqForm.controls['mark'].setValue(item.mark);
        this.rqForm.controls['question_type'].setValue(item.question_type);
        this.rqForm.controls['explanation_text'].setValue(item.explanation_text);

        this.openEditModal(template);
    }

    
    openAddQuestionModal(template: TemplateRef<any>) {
        this.modalTitle = 'Add New Questions';
        this.btnSaveText = 'Save';
        this.modalRef = this.modalService.show(template, this.modalLgConfig);
    }

    openAddWrittenQuestionModal(template: TemplateRef<any>) {
        this.modalTitle = 'Upload Written Question';
        this.btnSaveText = 'Upload';
        this.modalRef = this.modalService.show(template, this.modalLgConfig);
    }

    openEditModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.modalLgConfig);
    }

    openModal(template: TemplateRef<any>) {
        this.modalTitle = 'Upload Questions using XLSX';
        this.btnSaveText = 'Upload';
        this.modalRef = this.modalService.show(template, this.modalSmConfig);
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

    onUpdateQuestionFormSubmit(){
        this.submitted = true;
        if (this.questionForm.invalid) {
            return;
        }

        const formData = new FormData();
        formData.append('id', this.questionForm.value.id);
        formData.append('question', this.questionForm.value.question);
        formData.append('question_image', this.questionForm.get('question_image').value);
        formData.append('option1', this.questionForm.value.option1);
        formData.append('option2', this.questionForm.value.option2);
        formData.append('option3', this.questionForm.value.option3);
        formData.append('option4', this.questionForm.value.option4);
        formData.append('option5', this.questionForm.value.option5);
        formData.append('option6', this.questionForm.value.option6);
        formData.append('correct_answer', this.questionForm.value.correct_answer);
        formData.append('correct_answer2', this.questionForm.value.correct_answer2);
        formData.append('correct_answer3', this.questionForm.value.correct_answer3);
        formData.append('correct_answer4', this.questionForm.value.correct_answer4);
        formData.append('correct_answer5', this.questionForm.value.correct_answer5);
        formData.append('correct_answer6', this.questionForm.value.correct_answer6);
        formData.append('explanation_text', this.questionForm.value.explanation_text);
        formData.append('option1_image', this.questionForm.get('option1_image').value);
        formData.append('option2_image', this.questionForm.get('option2_image').value);
        formData.append('option3_image', this.questionForm.get('option3_image').value);
        formData.append('option4_image', this.questionForm.get('option4_image').value);
        formData.append('option5_image', this.questionForm.get('option5_image').value);
        formData.append('option6_image', this.questionForm.get('option6_image').value);
        formData.append('explanation', this.questionForm.get('explanation').value);

        this.blockUI.start('Updating data. Please wait...');
        this._service.post('updateTestQuestionAttachment', formData).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getQuestionList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    onAddQuestionFormSubmit(){
        this.submitted = true;
        if (this.questionForm.invalid) {
            return;
        }

        let question = {
            paid_course_material_id: this.paid_course_test_id,
            question: this.questionForm.value.question,
            option1: this.questionForm.value.option1,
            option2: this.questionForm.value.option2,
            option3: this.questionForm.value.option3,
            option4: this.questionForm.value.option4,
            option5: this.questionForm.value.option5,
            option6: this.questionForm.value.option6,
            correct_answer: this.questionForm.value.correct_answer ? 1 : null,
            correct_answer2: this.questionForm.value.correct_answer2 ? 2 : null,
            correct_answer3: this.questionForm.value.correct_answer3 ? 3 : null,
            correct_answer4: this.questionForm.value.correct_answer4 ? 4 : null,
            correct_answer5: this.questionForm.value.correct_answer5 ? 5 : null,
            correct_answer6: this.questionForm.value.correct_answer6 ? 6 : null,
            explanation_text: this.questionForm.value.explanation_text,
        }

        this.blockUI.start('Adding question. Please wait...');
        this._service.post('addPaidCourseTestQuestion', question).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getQuestionList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    onAddWrittenQuestionFormSubmit(){
        this.rqForm.controls['paid_course_material_id'].setValue(this.paid_course_test_id);
        this.submitted = true;
        if (this.rqForm.invalid) {
            return;
        }

        console.log(this.rqForm.value);

        this.blockUI.start('Adding question. Please wait...');
        this._service.post('addUpdatePaidCourseTestWrittenQuestion', this.rqForm.value).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getQuestionList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    onFormSubmit(){
        this.submitted = true;
        if (this.uploadMCQForm.invalid) {
            return;
        }

        let params = {
            paid_course_material_id : this.paid_course_test_id,
            question_set_id : this.uploadMCQForm.value.question_set_id,
            paid_course_material_subject_id : this.uploadMCQForm.value.subject,
            questions: this.importedData
        }

        this._service.post('addPaidCourseQuizQuestionExcel', params).subscribe(
            data => {
                this.blockUI.stop();
                this.toastr.success(data.messages, 'Success', { timeOut: 2000 });
                this.modalHide();
                this.getQuestionList();
            },
            err => {
                this.blockUI.stop();
                this.toastr.warning(err.messages || err, 'Warning!', { closeButton: true, disableTimeOut: false });
            }
        );
    }

    resetFilterList() {
        this.filterForm.reset();
        this.getQuestionList();
    }

    filterList() {
        this.rows = [];
        this.page.pageNumber = 0
        this.getQuestionList()
    }

    backToLocation() {
        this.location.back();
    }
}
