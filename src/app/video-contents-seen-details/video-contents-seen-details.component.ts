import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Page } from '../_models/page';
import { CommonService } from '../_services/common.service';


@Component({
  selector: 'app-video-contents-seen-details',
  templateUrl: './video-contents-seen-details.component.html',
  styleUrls: ['./video-contents-seen-details.component.scss']
})
export class VideoContentsSeenDetailsComponent implements OnInit {

  id: string;
  isEdit: boolean;
  ColumnMode = ColumnMode;

  filterForm: FormGroup;
  submitted = false;
  @BlockUI() blockUI: NgBlockUI;
  btnSaveText = 'Save';
  loadingIndicator = false;

  page = new Page();
  rows = [];
  filteredData = [];
  subject: any;
  @ViewChild(DatatableComponent) tableComponent: DatatableComponent;

  constructor(
    public formBuilder: FormBuilder,
    private _service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.page.pageNumber = 0;
    this.page.size = 20;
    if (this.route.snapshot.paramMap.has("id")) {
      this.id = this.route.snapshot.paramMap.get("id");
      this.getList();
    }

  }


  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      name: [null],

    });
  }


  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getList();
  }

  getList() {
    this.loadingIndicator = true;
    const obj = {
      size: this.page.size,
      pageNumber: this.page.pageNumber,
      subjectId: this.id,
    };
    this._service.get('Learner/GetVideoContentSeenBySubjectId', obj).subscribe(res => {
      this.loadingIndicator = false;
      if (res.Status === 2) {
        this.toastr.warning(res.Message, 'Warning!', { timeOut: 2000 });
        return;
      }
      else if (res.Status === 1) {
        this.toastr.error(res.Message, 'Error!', { timeOut: 2000 });
        return;
      }

      if (res.Data) this.subject = res.Data.List[0].Subject


      this.rows = res.Data.List;
     // this.filteredData = this.rows;

      this.page.totalElements =res.Data.Total;
      this.page.totalPages = this.page.totalElements / this.page.size;
      setTimeout(() => {
        this.loadingIndicator = false;
        this.tableComponent.recalculate();
      }, 1000);
    }, err => {
      this.toastr.warning(err.Message || err, 'Warning!', { closeButton: true, disableTimeOut: false });
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 1000);
    });
  }

  filterDatatable(event) {

    const val = event.target.value.toLowerCase();
    if (val) {
      // filter our data
      const temp = this.filteredData.filter(function (d) {
        return d.Name.toLowerCase().indexOf(val) !== -1 ||
          d.Participation.toLowerCase().indexOf(val) !== -1 ||
          !val;
      });
      this.rows = temp;
    }

    if (!val) this.rows = this.filteredData;


  }


}
