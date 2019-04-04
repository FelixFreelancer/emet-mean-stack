import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  btnGroupModel = {
    left: true,
    middle: false,
    right: false
  };

  constructor(private router: Router) {}

  ngOnInit() {}
  goHome() {
    this.router.navigate(['/item/list/']);
  }


}
