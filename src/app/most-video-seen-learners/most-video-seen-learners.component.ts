import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { AuthenticationService } from '../_services/authentication.service';
import { CommonService } from '../_services/common.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { Page } from '../_models/page';


@Component({
    selector: 'app-most-video-seen-learners',
    templateUrl: './most-video-seen-learners.component.html',
    encapsulation: ViewEncapsulation.None
})

export class MostVideoSeenLearnersComponent implements OnInit {

    @BlockUI() blockUI: NgBlockUI;
    entryForm: FormGroup;
  
    baseUrl = environment.baseUrl;
    submitted = false;
    currentUser: any;
    fileName: '';
    filterForm: FormGroup;

    ColumnMode = ColumnMode;
    page = new Page();
    rows = [];
    
    loadingIndicator = false;
    bsConfig: Partial<BsDaterangepickerConfig>;
    bsValue: Date[] = [];

    areaList: Array<any> = [
      {Id:1 ,Name: "কক্সবাজার", IsSelected: false },
      {Id:2 ,Name: "কিশোরগঞ্জ", IsSelected: false },
      {Id:3 ,Name: "কুমিল্লা", IsSelected: false },
      {Id:4 ,Name: "কুষ্টিয়া", IsSelected: false },
      {Id:5 ,Name: "কুড়িগ্রাম", IsSelected: false },
      {Id:6 ,Name: "খাগড়াছড়ি", IsSelected: false },
      {Id:7 ,Name: "খুলনা", IsSelected: false },
      {Id:8 ,Name: "গাইবান্ধা", IsSelected: false },
      {Id:9 ,Name: "গাজীপুর", IsSelected: false },
      {Id:10 ,Name: "গোপালগঞ্জ", IsSelected: false },
      {Id:11 ,Name: "কক্সবাজার", IsSelected: false },
      {Id:12 ,Name: "চট্টগ্রাম", IsSelected: false },
      {Id:13 ,Name: "চাঁদপুর", IsSelected: false },
      {Id:14 ,Name: "চাঁপাইনবাবগঞ্জ", IsSelected: false },
      {Id:15 ,Name: "চুয়াডাঙ্গা", IsSelected: false },
      {Id:16 ,Name: "জামালপুর", IsSelected: false },
      {Id:17 ,Name: "জয়পুরহাট", IsSelected: false },
      {Id:18 ,Name: "ঝালকাঠি", IsSelected: false },
      {Id:19 ,Name: "ঝিনাইদহ", IsSelected: false },
      {Id:20 ,Name: "টাঙ্গাইল", IsSelected: false },
      {Id:21 ,Name: "ঠাকুরগাঁও", IsSelected: false },
      {Id:22 ,Name: "ঢাকা", IsSelected: false },
      {Id:23 ,Name: "দিনাজপুর", IsSelected: false },
      {Id:24 ,Name: "নওগাঁ", IsSelected: false },
      {Id:25 ,Name: "নড়াইল", IsSelected: false },
      {Id:26 ,Name: "নরসিংদী", IsSelected: false },
      {Id:27 ,Name: "নাটোর", IsSelected: false },
      {Id:28 ,Name: "নারায়ণগঞ্জ", IsSelected: false },
      {Id:29 ,Name: "নীলফামারী", IsSelected: false },
      {Id:30 ,Name: "নেত্রকোণা", IsSelected: false },
      {Id:31 ,Name: "নোয়াখালী", IsSelected: false },
      {Id:32 ,Name: "পঞ্চগড়", IsSelected: false },
      {Id:33 ,Name: "পটুয়াখালী", IsSelected: false },
      {Id:34 ,Name: "পাবনা", IsSelected: false },
      {Id:35 ,Name: "পিরোজপুর", IsSelected: false },
      {Id:36 ,Name: "ফরিদপুর", IsSelected: false },
      {Id:37 ,Name: "ফেনী", IsSelected: false },
      {Id:38 ,Name: "বগুড়া", IsSelected: false },
      {Id:39 ,Name: "বরগুনা", IsSelected: false },
      {Id:40 ,Name: "বরিশাল", IsSelected: false },
      {Id:41 ,Name: "বাগেরহাট", IsSelected: false },
      {Id:42 ,Name: "বান্দরবান", IsSelected: false },
      {Id:43 ,Name: "ব্রাহ্মণবাড়িয়া", IsSelected: false },
      {Id:44 ,Name: "ভোলা", IsSelected: false },
      {Id:45 ,Name: "মাগুরা", IsSelected: false },
      {Id:46 ,Name: "মাদারীপুর", IsSelected: false },
      {Id:47 ,Name: "মানিকগঞ্জ", IsSelected: false },
      {Id:48 ,Name: "মুন্সিগঞ্জ", IsSelected: false },
      {Id:49 ,Name: "মেহেরপুর", IsSelected: false },
      {Id:50 ,Name: "মৌলভীবাজার", IsSelected: false },
      {Id:51 ,Name: "ময়মনসিংহ", IsSelected: false },
      {Id:52 ,Name: "যশোর", IsSelected: false },
      {Id:53 ,Name: "রংপুর", IsSelected: false },
      {Id:54 ,Name: "রাঙ্গামাটি", IsSelected: false },
      {Id:55 ,Name: "রাজবাড়ী", IsSelected: false },
      {Id:56 ,Name: "রাজশাহী", IsSelected: false },
      {Id:57 ,Name: "লক্ষ্মীপুর", IsSelected: false },
      {Id:58 ,Name: "লালমনিরহাট", IsSelected: false },
      {Id:59 ,Name: "শরীয়তপুর", IsSelected: false },
      {Id:60 ,Name: "শেরপুর", IsSelected: false },
      {Id:61 ,Name: "সাতক্ষীরা", IsSelected: false },
      {Id:62 ,Name: "সিরাজগঞ্জ", IsSelected: false },
      {Id:63 ,Name: "সিলেট", IsSelected: false },
      {Id:64 ,Name: "সুনামগঞ্জ", IsSelected: false },
      {Id:65 ,Name: "হবিগঞ্জ", IsSelected: false },
  ];
    @ViewChild('pdfViewerOnDemand', { static: false }) pdfViewerOnDemand: any;
    reportFileName: string;

    constructor(
        private authService: AuthenticationService,
        public formBuilder: FormBuilder,
        private _service: CommonService,
        private toastr: ToastrService,
    ) {
        this.currentUser = this.authService.currentUserDetails.value;
    }

    ngOnInit() {
        this.filterForm = this.formBuilder.group({
        limit: [null],
      });
    }

    get f() {
        return this.entryForm.controls;
    }

    setPage(pageInfo) {
      this.page.pageNumber = pageInfo.offset;
      this.getList();
    }

    Upload() {
        this.submitted = true;
        if (this.entryForm.invalid) {
          return;
        }
    
        this.blockUI.start('Saving...');
    
        const obj = {
          File: [null],
          FileSource: [null]
        };
    
        const formData = new FormData();
        formData.append('Model', JSON.stringify(obj));
        if (this.entryForm.value.FileSource) formData.append('File', this.entryForm.value.FileSource);
    
        this.blockUI.start('Saving data. Please wait...');
        this._service.post('sales-order/create-or-update', formData).subscribe(
          data => {
            this.blockUI.stop();
            if (!data.Success) {
              this.toastr.warning(data.Message, 'Warning!', { closeButton: true, disableTimeOut: false });
              return;
            }
            this.toastr.success(data.Message, 'SALES ORDER', { timeOut: 2000 });
            this.entryForm.reset();
    
            this.getItem();
            this.submitted = false;
          },
          err => {
            this.blockUI.stop();
            this.toastr.warning(err.message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
          }
        );
    
      }

      getItem() {
        this.blockUI.start('Getting data...');
        this._service.get('designation/get').subscribe(res => {
          this.blockUI.stop();
          if (!res.Success) {
            this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
            return;
          }
       this.fileName= res.Record.Name
        }, err => {
          this.blockUI.stop();
          this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
        });
      }

      onFileChange(event) {

        if (event.target.files.length > 0) {
          const file = event.target.files[0];
          this.entryForm.patchValue({
            FileSource: file
          });
        }
      }

      getList() {
        this.loadingIndicator = true;
        const obj = {
          limit: this.filterForm.value.limit,
          areas: this.areaList.filter(x=>x.IsSelected===true).map(x=>x.Name),
        };
        this._service.get('trainee/list', obj).subscribe(res => {
          if (!res.Success) {
            this.toastr.warning(res, 'Warning!', { closeButton: true, disableTimeOut: false });
            return;
          }
          this.rows = res.Records;
          this.page.totalElements = this.rows.length;
          this.page.totalPages = this.page.totalElements / this.page.size;
          setTimeout(() => {
            this.loadingIndicator = false;
            
          }, 1000);
        }, err => {
          this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
          setTimeout(() => {
            this.loadingIndicator = false;
          }, 1000);
        });
      }
      download(){}
    }