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
    selector: 'app-instruction-audios',
    templateUrl: './instruction-audios.component.html',
    encapsulation: ViewEncapsulation.None
})

export class InstructionAudiosComponent implements OnInit {

    @BlockUI() blockUI: NgBlockUI;
    entryForm: FormGroup;
  
    baseUrl = environment.baseUrl;
    submitted = false;
    currentUser: any;
    fileName: '';

    bsConfig: Partial<BsDaterangepickerConfig>;
    bsValue: Date[] = [];

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
        this.entryForm = this.formBuilder.group({
            File: [null,[Validators.required]],
            FileSource: [null],
        });
      
    }

    get f() {
        return this.entryForm.controls;
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
    }