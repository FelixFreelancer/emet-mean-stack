import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomValidators } from 'ng2-validation';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FileSelectDirective, FileUploader} from 'ng2-file-upload';
import { Router , ActivatedRoute} from '@angular/router';
import { UrlJSON } from '../../json/urlJSON';
import { countryJSON } from '../../json/countryJSON';
@Component({
  selector: 'app-user-add-form',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})


export class UserAddComponent implements OnInit {
  formBasic: FormGroup;
  loading: boolean;
  radioGroup: FormGroup;
  radioGroup_active: FormGroup;
  modalSmall: any;
  @ViewChild('smallModal_view') smallModal_view: ElementRef;
  selectedFile = null;
  chooseFileName = 'Choose File';
  countryArr = countryJSON;
  fileType = false;
  // addUserData = {role: 0, active: 0, picture: ''};
  addUserData = {role: 0, active: 0, picture: '', firstName: '', lastName: '', email: '', password: '', country: '',
  city: '', companyName: '', jobTitle: '', facebook: '', linkdin: '', phoneNumber: '', comments: ''};
  _uploadPictureToMongoUrl = UrlJSON.uploadPictureToMongoUrl;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UserService,
    private modalService: NgbModal,
    private router: Router ,
    private http: HttpClient,
    private el: ElementRef
  ) { }

  ngOnInit() {
    localStorage.setItem('itemPage', '1');
    this.buildFormBasic();
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

  submit() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.toastr.success('Profile updated.', 'Success!', {progressBar: true});
    }, 3000);
  }

  addUser() {
    if (this.fileType) {
      return;
    }
    this.addUserData.role = this.radioGroup.value.radio;
    this.addUserData.active = this.radioGroup_active.value.radio_active;
    this.userService.addUser(this.addUserData)
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
  gotoList() {
    this.router.navigate([`/user/list`]);
  }
  onFileSelected(event) {
    this.fileType = event.target.files[0].type === '';
    if (this.fileType) {
      return;
    }
    this.chooseFileName = event.target.files[0].name;
    const inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
        const fileCount: number = inputEl.files.length;
        const formData = new FormData();
        if (fileCount > 0) { // a file was selected
            for (let i = 0; i < fileCount; i++) {
                formData.append('file', inputEl.files.item(i));
            }
            this.http
                .post(this._uploadPictureToMongoUrl, formData).subscribe(
                  res => {
                    this.addUserData.picture = res['fileName'];
                   },
                  err => console.log(err));
        }
  }

  }


