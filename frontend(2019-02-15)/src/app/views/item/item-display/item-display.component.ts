import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ItemService } from 'src/app/shared/services/item.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FileSelectDirective, FileUploader} from 'ng2-file-upload';
import { Router , ActivatedRoute} from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { UrlJSON } from '../../json/urlJSON';
@Component({
  selector: 'app-item-display-form',
  templateUrl: './item-display.component.html',
  styleUrls: ['./item-display.component.scss']
})


export class ItemDisplayComponent implements OnInit, AfterViewInit {
  formBasic: FormGroup;
  loading: boolean;
  radioGroup: FormGroup;
  radioGroup_active: FormGroup;
  modalSmall: any;
  @ViewChild('smallModal_view') smallModal_view: ElementRef;
  selectedFile = null;
  chooseFileName = 'Choose File';
  id = '';
  displayURL;
  itemOwn = false;

  editItemData = {id: '', picture: 'default.jpg', type: 'All', interest: 'All', activity: '', geoCountry: '', fromAmount: 0, toAmount: 0,
                  about: '', geoCity: '', video: '', details: ''};
  user = {firstName: '', lastName: '', role: 0, email: '', phoneNumber: '', picture: '' };
  item = {video: 'https://youtube.com', picture: 'default.jpg', details: '', interest: '', activity: '', geoCountry: '', geoCity: '',
          fromAmount: 0, toAmount: 0, publishDate: '', updateDate: ''};
  _uploadPictureUrl = UrlJSON.uploadPictureUrl;
  role = '0';


  constructor(
    private toastr: ToastrService,
    private itemService: ItemService,
    private modalService: NgbModal,
    private http: HttpClient,
    private el: ElementRef,
    private router: Router ,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    // this.displayURL = sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/tgbNymZ7vqY');
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.role = localStorage.getItem('role');
      let video_url = 'https://youtube.com/embed/';
      this.displayURL = this.sanitizer.bypassSecurityTrustResourceUrl(video_url);
      this.itemService.getDisplayItemByID(params.id).subscribe(res => {
        this.user = res.user;
        this.item = res.item;
        this.transform(this.user);
        this.transform(this.item);
        if (res.user._id === localStorage.getItem('userId')) {
          this.itemOwn = true;
        }
        if (res.item.picture === 'default.jpg') {
          this.item.picture = '../../../../assets/images/item/default.png';
        } else {
          if (res.item.extraBlob === '2') {
            this.item.picture = UrlJSON.displayPictureFromFSUrl + this.item.picture;
          } else {
            this.item.picture = UrlJSON.displayPictureUrl + this.item.picture;
          }
        }
        if (res.user.picture === 'default.png') {
          this.user.picture = '../../../../assets/images/avatar/default.png';
        } else {
          if (res.user.extraBlob === '2') {
            this.user.picture = UrlJSON.displayAvatarFromFSUrl + this.user.picture;
          } else {
            this.user.picture = UrlJSON.displayPictureUrl + this.user.picture;
          }
        }

        video_url += this.item.video;
        this.displayURL = this.sanitizer.bypassSecurityTrustResourceUrl(video_url);
        console.log(this.displayURL.changingThisBreaksApplicationSecurity);
      });
    });
  }
  transform(obj) {
    for (const key of Object.keys(obj)) {
      obj[key] = this.convert(obj[key]);
    }
  }
  convert(value: string) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = value;
    return tempElement.innerText;
  }
  itemEdit() {
    this.router.navigate([`/item/edit/${this.id}`]);
  }
  gotoList() {
    this.router.navigate([`/item/list`]);
  }
  ngAfterViewInit() {
    const video_url = 'https://youtube.com/embed/' + this.item.video ;
    this.displayURL = this.sanitizer.bypassSecurityTrustResourceUrl(video_url);
  }

  }


