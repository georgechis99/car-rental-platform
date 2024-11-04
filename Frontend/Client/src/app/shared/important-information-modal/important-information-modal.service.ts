import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImportantInformationModalComponent } from './important-information-modal.component';

@Injectable()
export class ImportantInformationModalService {

  constructor(private modalService: NgbModal) { }

  public confirm( dialogSize: 'sm'|'lg' = 'sm' ): Promise<boolean> {
    const modalRef = this.modalService.open(ImportantInformationModalComponent, { size: dialogSize });

    return modalRef.result;
  }

}
