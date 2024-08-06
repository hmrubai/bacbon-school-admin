import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { PDFShowModalComponent } from "./pdf-show-modal.component";

@NgModule({
    imports: [
        CommonModule,
        PdfJsViewerModule
    ],
    declarations: [
        PDFShowModalComponent
    ],
    exports: [PDFShowModalComponent],
    entryComponents: [PDFShowModalComponent]
})
export class PDFShowModalModule {}