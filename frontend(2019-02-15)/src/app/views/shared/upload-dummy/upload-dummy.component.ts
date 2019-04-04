import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomValidators } from 'ng2-validation';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router , ActivatedRoute} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FileSelectDirective, FileUploader} from 'ng2-file-upload';


@Component({
  selector: 'app-upload-dummy',
  templateUrl: './upload-dummy.component.html',
  styleUrls: ['./upload-dummy.component.scss']
})
export class UploadDummyComponent implements OnInit {
  formBasic: FormGroup;
  loading: boolean;
  radioGroup: FormGroup;
  radioGroup_active: FormGroup;
  itemCount = 10;
  userCount = 10;
  modalSmall: any;
  @ViewChild('smallModal_view') smallModal_view: ElementRef;
  @ViewChild('errorModal_view') errorModal_view: ElementRef;

  id: String;
  user: any = {};

  currentUserData: any = {picture: 'default.png'};
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private modalService: NgbModal,
    private router: Router ,
    private route: ActivatedRoute,
    private http: HttpClient,
    private el: ElementRef
  ) { }

  ngOnInit() {
  }

  onDummyUpload() {
    this.userService.loadFromLocalToDb()
        .subscribe(
          res => {
            const el: HTMLElement = this.smallModal_view.nativeElement as HTMLElement;
            el.click();
          },
          err => console.log(err));
  }

  onDummyCreate() {
    this.userService.createDummyData(this.userCount, this.itemCount)
        .subscribe(
          res => {
            console.log(res);
            if (res['error_not_found']) {
              const el: HTMLElement = this.errorModal_view.nativeElement as HTMLElement;
              el.click();
            } else {
              const el: HTMLElement = this.smallModal_view.nativeElement as HTMLElement;
              el.click();
            }
          },
          err => console.log(err));
  }

  submit() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.toastr.success('Profile updated.', 'Success!', {progressBar: true});
    }, 3000);
  }

  upDateUser() {
    this.currentUserData.role = this.radioGroup.value.radio;
    this.currentUserData.active = this.radioGroup_active.value.radio_active;
    this.userService.updateUser(this.id, this.currentUserData)
        .subscribe(
          res => {
            console.log(res);
            const el: HTMLElement = this.smallModal_view.nativeElement as HTMLElement;
            el.click();
           },
          err => console.log(err));
  }

  openSmall(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'sm' })
    .result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log('Err!', reason);
    });
  }

  }


