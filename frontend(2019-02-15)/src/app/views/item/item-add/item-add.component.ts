import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ItemService } from 'src/app/shared/services/item.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FileSelectDirective, FileUploader} from 'ng2-file-upload';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings  } from 'angular-2-dropdown-multiselect';
import { countryJSON } from '../../json/countryJSON';
import { activityJSON } from '../../json/activityJSON';
import { typeJSON } from '../../json/typeJSON';
import { interestJSON } from '../../json/interestJSON';
import { UrlJSON } from '../../json/urlJSON';
import { Router , ActivatedRoute} from '@angular/router';
import { BiggerMatch } from '../_helpers/bigger-match.validator';

@Component({
  selector: 'app-item-add-form',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.scss']
})


export class ItemAddComponent implements OnInit {
  addItemForm: FormGroup;
  submitted = false;
  loading: boolean;

  modalSmall: any;
  @ViewChild('smallModal_view') smallModal_view: ElementRef;
  selectedFile = null;
  chooseFileName = 'Choose File';
  fileType = false;
  choosePicture = '';
  addItemData = {user_id: '', picture: 'default.jpg', type: 'All', interest: 'All', activity: '', geoCountry: '',
                 fromAmount: 1000, toAmount: 1000, about: '', geoCity: '', video: '', details: ''};
  _uploadPictureUrl = UrlJSON.uploadPictureUrl;
  _uploadPictureToMongoUrl = UrlJSON.uploadPictureToMongoUrl;




countryArr = countryJSON;
activityArr = activityJSON;
interestArr = interestJSON;
typeArr = typeJSON;

aboutValidFlag = false;
cityValidFlag = false;
videoValidFlag = false;
commentsValidFlag = false;

defaultFromAmount = 1000;
defaultFromAmount1 ;
defaultToAmount = 1000;

modal_title = 'Save';
modal_content = 'Saved Successfully.';

activityModel: number[];
activityOptions: IMultiSelectOption[];
activityWarn = false;

countryModel: number[];
countryOptions: IMultiSelectOption[];
countryWarn = false;

activitySettings: IMultiSelectSettings = {
  enableSearch: true,
  checkedStyle: 'fontawesome',
  buttonClasses: 'btn btn-default btn-block btn-rounded btn-after',
  dynamicTitleMaxItems: 5,
  displayAllSelectedText: true,
  containerClasses: 'custom-dropdown'
};

// Text configuration
activityTexts: IMultiSelectTexts = {
  checkAll: 'Select all',
  uncheckAll: 'Unselect all',
  checked: 'item selected',
  checkedPlural: 'items selected',
  searchPlaceholder: 'Find',
  searchEmptyResult: 'Nothing found...',
  searchNoRenderText: 'Type in search box to see results...',
  defaultTitle: 'Select Activity',
  allSelected: 'All selected',
};

countrySettings: IMultiSelectSettings = {
  enableSearch: true,
  checkedStyle: 'fontawesome',
  buttonClasses: 'btn btn-default btn-block btn-rounded btn-after',
  dynamicTitleMaxItems: 8,
  displayAllSelectedText: true,
  containerClasses: 'custom-dropdown'
};

// Text configuration
countryTexts: IMultiSelectTexts = {
  checkAll: 'Select all',
  uncheckAll: 'Unselect all',
  checked: 'item selected',
  checkedPlural: 'items selected',
  searchPlaceholder: 'Find',
  searchEmptyResult: 'Nothing found...',
  searchNoRenderText: 'Type in search box to see results...',
  defaultTitle: 'Select Country',
  allSelected: 'All selected',
};

  uploader: FileUploader = new FileUploader({url: this._uploadPictureUrl});
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private itemService: ItemService,
    private modalService: NgbModal,
    private http: HttpClient,
    private el: ElementRef,
    private router: Router ,
  ) { }

  ngOnInit() {
    localStorage.setItem('userPage', '1');
    this.addItemForm = this.formBuilder.group({
      about: ['', Validators.required],
      geoCity: ['', Validators.required],
      video: ['', Validators.required],
      details: ['', Validators.required],
      type: ['', Validators.required],
      interest: ['', Validators.required],
      activity: ['', Validators.required],
      geoCountry: ['', Validators.required],
      fromAmount: ['', Validators.required],
      toAmount: ['', Validators.required]
    }, {
      validator: BiggerMatch('fromAmount', 'toAmount')
    });
  }


  submit() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.toastr.success('Profile updated.', 'Success!', {progressBar: true});
    }, 3000);
  }
  _keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.keyCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      return false;
    }
}

  get f() { return this.addItemForm.controls; }
  addItem() {
    this.submitted = true;
    if (this.addItemForm.invalid) {
      return;
    }
    if (this.fileType) {
      return;
    }
    if (this.choosePicture !== '') {
      this.addItemForm.value.picture = this.choosePicture;
    }
    this.addItemForm.value.user_id = localStorage.getItem('userId');
    this.itemService.addItem(this.addItemForm.value)
        .subscribe(
          res => {
            console.log(res);
            this.modal_title = 'Save';
            this.modal_content = 'Saved Successfully.';
            const el: HTMLElement = this.smallModal_view.nativeElement as HTMLElement;
            el.click();
           },
          err => console.log(err));
  }
  cancel() {
    this.router.navigate([`/item/list`]);
  }
  openSmall(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'sm' })
    .result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log('Err!', reason);
    });
  }

  onFileSelected(event) {
    this.fileType = event.target.files[0].type === '' || event.target.files[0].type.indexOf('image') === -1;
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
                    this.addItemData.picture = res['fileName'];
                    this.choosePicture = res['fileName'];
                    this.chooseFileName = res['fileName'];
                   },
                  err => console.log(err));
        }
  }


  }


