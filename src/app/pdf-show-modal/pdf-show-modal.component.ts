import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pdf-show-modal',
  templateUrl: './pdf-show-modal.component.html',
  styleUrls: ['./pdf-show-modal.component.css']
})
export class PDFShowModalComponent implements OnInit {

  title: string = 'PDF File';
  fileName: string = 'download.pdf';
  file: any;
  pdfSrc: any;
  height: number = 100;
  startPrint: boolean = false;
  @ViewChild('pdfViewerOnDemand', { static: true }) pdfViewerOnDemand: any;

  constructor(public bsModalRef: BsModalRef) {

  }


  ngOnInit() {
    this.pdfViewerOnDemand.pdfSrc = this.pdfSrc; // pdfSrc can be Blob or Uint8Array
    this.pdfViewerOnDemand.refresh();
  }


}
