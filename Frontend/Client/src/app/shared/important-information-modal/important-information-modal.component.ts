import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'important-information-modal',
  templateUrl: './important-information-modal.component.html',
  styleUrls: ['./important-information-modal.component.scss'],
})
export class ImportantInformationModalComponent implements OnInit {

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}
