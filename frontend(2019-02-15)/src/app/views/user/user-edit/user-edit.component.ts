import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomValidators } from 'ng2-validation';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router , ActivatedRoute} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FileSelectDirective, FileUploader} from 'ng2-file-upload';
import { UrlJSON } from '../../json/urlJSON';
import { countryJSON } from '../../json/countryJSON';

@Component({
  selector: 'app-user-edit-form',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  formBasic: FormGroup;
  loading: boolean;
  radioGroup: FormGroup;
  radioGroup_active: FormGroup;
  modalSmall: any;
  @ViewChild('smallModal_view') smallModal_view: ElementRef;

  id: String;
  user: any = {};
  role = '0';
  fileType = false;
  countryArr = countryJSON;
  currentUserData: any = {picture: 'default.png', pictureChanged: false, linkdin: '', facebook: ''};
  _uploadPictureToMongoUrl = UrlJSON.uploadPictureToMongoUrl;
  @ViewChild('confirmModal_view') confirmModal_view: ElementRef;
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
    this.buildFormBasic();
    this.role = localStorage.getItem('role');
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.userService.getUserByID(this.id).subscribe(res => {
        this.currentUserData = res;
        this.radioGroup = this.fb.group({
          radio: [this.currentUserData.role]
        });
        this.radioGroup_active = this.fb.group({
          radio_active: [this.currentUserData.active]
        });
      });
    });
    this.radioGroup = this.fb.group({
      radio: [0]
    });
    this.radioGroup_active = this.fb.group({
      radio_active: [0]
    });
  }

  buildFormBasic() {
    this.formBasic = this.fb.group({
      experience: []
    });
  }

  convert(value) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = value;
    return tempElement.innerText;
  }

  convertObj(obj) {
    for (const key of Object.keys(obj)) {
      obj[key] = this.convert(obj[key]);
    }
  }
  submit() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.toastr.success('Profile updated.', 'Success!', {progressBar: true});
    }, 3000);
  }

  linkdinChange(value) {
    this.currentUserData.linkdin = value;
  }
  facebookChange(value) {
    this.currentUserData.facebook = value;
  }
  upDateUser() {
    if (this.fileType) {
      return;
    }
    this.currentUserData.role = this.radioGroup.value.radio;
    this.currentUserData.active = this.radioGroup_active.value.radio_active;
    this.convertObj(this.currentUserData);
    this.userService.updateUser(this.id, this.currentUserData)
        .subscribe(
          res => {
            console.log(res);
            const el: HTMLElement = this.smallModal_view.nativeElement as HTMLElement;
            el.click();
           },
          err => console.log(err));
  }
  onFileSelected(event) {
    this.currentUserData.picture = event.target.files[0].name;
    this.fileType = event.target.files[0].type === '';
    if (this.fileType) {
      return;
    }
    const inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
        const fileCount: number = inputEl.files.length;
        const formData = new FormData();
        if (fileCount > 0) { // a file was selected
            for (let i = 0; i < fileCount; i++) {
                formData.append('file', inputEl.files.item(i));
            }
            console.log(formData);
            this.http
                .post(this._uploadPictureToMongoUrl, formData).subscribe(
                  res => {
                    console.log(res);
                    this.currentUserData.picture = res['fileName'];
                    this.currentUserData.pictureChanged = true;
                   },
                  err => console.log(err));
        }
  }

  openSmall(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'sm' })
    .result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log('Err!', reason);
    });
  }

  confirm(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    .result.then((result) => {
      if (result === 'Ok') {
        this.userService.removeUser(this.id).subscribe(() => {
          this.router.navigate([`/user/list`]);
        });
      }
    }, (reason) => {
    });
  }
  gotoList() {
    this.router.navigate([`/user/list`]);
  }

  removeUser() {
    const el: HTMLElement = this.confirmModal_view.nativeElement as HTMLElement;
    el.click();
  }

  }


