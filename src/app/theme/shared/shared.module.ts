import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertModule, BreadcrumbModule, CardModule } from './components';
import { DataFilterPipe } from './components/data-table/data-filter.pipe';
import { TodoListRemoveDirective } from './components/todo/todo-list-remove.directive';
import { TodoCardCompleteDirective } from './components/todo/todo-card-complete.directive';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ClickOutsideModule } from 'ng-click-outside';

import { SpinnerComponent } from './components/spinner/spinner.component';
import { ApexChartComponent } from './components/chart/apex-chart/apex-chart.component';
import {ApexChartService} from './components/chart/apex-chart/apex-chart.service';
// import { ToastComponent } from './components/toast/toast.component';
// import {ToastService} from './components/toast/toast.service';

import { TabsModule } from 'ngx-bootstrap/tabs';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { NumericDirective } from './../../_helpers/numbers-only';
import { BlockUIModule } from 'ng-block-ui';
import { MomentModule } from 'ngx-moment';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { UploadDialogComponent } from './../../_helpers/upload-dialog/dialog.component';
import { UploadService } from './../../_services/upload.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { PDFShowModalModule } from 'src/app/pdf-show-modal/pdf-show-modal.module';
import { FloorPipe } from 'src/app/_helpers/floor.pipe';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    CardModule,
    BreadcrumbModule,
    ClickOutsideModule,
   

    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    NgxDatatableModule,
    NgSelectModule,
    BlockUIModule.forRoot(),
    MomentModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatProgressBarModule,
    // UiSwitchModule,
    TimepickerModule.forRoot(),
    PdfJsViewerModule,
    UiSwitchModule,
    PDFShowModalModule,
  ],
  entryComponents: [UploadDialogComponent],
  exports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    CardModule,
    BreadcrumbModule,
    ModalModule,
    DataFilterPipe,
    TodoListRemoveDirective,
    TodoCardCompleteDirective,
    ClickOutsideModule,
    SpinnerComponent,
    ApexChartComponent,

    TabsModule,
    PaginationModule,
    BsDatepickerModule,
    ModalModule,
    NgxDatatableModule,
    NgSelectModule,
    BlockUIModule,
    MomentModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatProgressBarModule,
    // UiSwitchModule,
    TimepickerModule,
    PdfJsViewerModule,
    NumericDirective,
    UiSwitchModule,
    PDFShowModalModule,
    FloorPipe
  ],
  declarations: [
    DataFilterPipe,
    TodoListRemoveDirective,
    TodoCardCompleteDirective,
    SpinnerComponent,
    ApexChartComponent,
    NumericDirective,
    UploadDialogComponent,
    FloorPipe
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    UploadService,
    ApexChartService
  ]
})
export class SharedModule { }
