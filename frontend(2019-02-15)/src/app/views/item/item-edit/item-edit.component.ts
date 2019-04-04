import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ItemService } from 'src/app/shared/services/item.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FileSelectDirective, FileUploader} from 'ng2-file-upload';
import { Router , ActivatedRoute} from '@angular/router';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings  } from 'angular-2-dropdown-multiselect';
import { countryJSON } from '../../json/countryJSON';
import { activityJSON } from '../../json/activityJSON';
import { typeJSON } from '../../json/typeJSON';
import { interestJSON } from '../../json/interestJSON';
import { UrlJSON } from '../../json/urlJSON';
@Component({
  selector: 'app-item-edit-form',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss']
})


export class ItemEditComponent implements OnInit {
  formBasic: FormGroup;
  loading: boolean;
  radioGroup: FormGroup;
  radioGroup_active: FormGroup;
  modalSmall: any;
  @ViewChild('smallModal_view') smallModal_view: ElementRef;
  @ViewChild('confirmModal_view') confirmModal_view: ElementRef;
  selectedFile = null;
  chooseFileName = 'Choose File';
  id = '';
  fileType = false;

  countryArr = countryJSON;
  activityArr = activityJSON;
  interestArr = interestJSON;
  typeArr = typeJSON;

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

  editItemData = {id: '', picture: 'default.jpg', type: 'All', interest: 'All', activity: '', geoCountry: ''
                  , fromAmount: 1000, toAmount: 1000, about: '', geoCity: '', video: '', details: ''};
  _uploadPictureUrl = UrlJSON.uploadPictureUrl;
  _uploadPictureToMongoUrl = UrlJSON.uploadPictureToMongoUrl;


  uploader: FileUploader = new FileUploader({url: this._uploadPictureUrl});
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private itemService: ItemService,
    private modalService: NgbModal,
    private http: HttpClient,
    private el: ElementRef,
    private router: Router ,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.buildFormBasic();
    // this.activityOptions = this.activityArr1;
    // this.countryOptions = this.countryArr1;
    this.editItemData.type = this.typeArr[0].name;
    this.editItemData.interest = this.interestArr[0].name;
    this.editItemData.activity = this.activityArr[0].name;
    this.editItemData.geoCountry = this.countryArr[0].name;

    this.route.params.subscribe(params => {
      this.id = params.id;
      this.itemService.getItemByID(params.id).subscribe(res => {
        this.editItemData = res;
      });
    });
  }

  buildFormBasic() {
    this.formBasic = this.fb.group({
      experience: []
    });
  }

  _keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.keyCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      return false;
    }
}
  submit() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.toastr.success('Profile updated.', 'Success!', {progressBar: true});
    }, 3000);
  }
  confirm(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    .result.then((result) => {
      if (result === 'Ok') {
        const remove_id = '["' + this.id + '"]';
        this.itemService.removeItems(remove_id).subscribe(() => {
          this.router.navigate([`/item/list`]);
        });
      }
    }, (reason) => {
    });
  }

  removeItem() {
    const el: HTMLElement = this.confirmModal_view.nativeElement as HTMLElement;
    el.click();
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
  updateItem() {
    // let activity = '';
    // if (this.activityModel) {
    //   for (let i = 0; i < this.activityModel.length; i++) {
    //     activity += this.activityArr1[this.activityModel[i] - 1].name + ',';
    //   }
    // }
    // this.activityWarn = activity === '' ? true : false;

    // let country = '';
    // if (this.countryModel) {
    //   for (let i = 0; i < this.countryModel.length; i++) {
    //     country += this.countryArr1[this.countryModel[i] - 1].name + ',';
    //   }
    // }
    // this.countryWarn = country === '' ? true : false;
    // if (this.activityWarn || this.countryWarn) {
    //   return;
    // }
    if (this.editItemData.fromAmount > this.editItemData.toAmount ) {
      return;
    }
    if (this.editItemData.fromAmount < 1000 ) {
      return;
    }
    if (this.fileType) {
      return;
    }
    // this.editItemData.activity = activity;
    // this.editItemData.geoCountry = country;
    this.convertObj(this.editItemData);
    this.itemService.updateItem(this.id, this.editItemData)
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
    this.router.navigate([`/item/list`]);
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
                    this.editItemData.picture = res['fileName'];
                   },
                  err => console.log(err));
        }
  }


  }


