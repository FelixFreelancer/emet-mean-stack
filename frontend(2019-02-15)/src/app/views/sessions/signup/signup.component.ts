import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AuthService } from '../../../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../_helpers/must-match.validator';
import {environment} from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [SharedAnimations]
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  email_duplicate = false;
  out_maxSignupCount = false;
  eventCaptcha = false;
  registerUserData = {};
  termsFlag = false;
  termsReadFlag = false;
  captchaSiteKey = environment.reCAPTCHA_Sitekey; // local environment
  modalSmall: any;
  agree_val = false;
  @ViewChild('termsModal_view') termsModal_view: ElementRef;
  constructor(private _auth: AuthService, private _router: Router, private formBuilder: FormBuilder, private modalService: NgbModal) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
  }, {
    validator: MustMatch('password', 'confirmPassword')
});
  }

   // convenience getter for easy access to form fields
   get f() { return this.registerForm.controls; }

  registerUser(registerUserData) {
    this._auth.registerUser(registerUserData)
    .subscribe(
      res => {
        localStorage.setItem('token', res.token);
        this._router.navigate(['auth/signin']);
       },
      err => {
        console.log(err);
        if (err === 'Method Not Allowed') {
          this.out_maxSignupCount = true;
        }
        if (err === 'Bad Request') {
          this.email_duplicate = true;
        }
      });
  }

  handleCorrectCaptcha(event) {
    this._auth.getCaptcha(event)
      .subscribe((res) => {
        if (res.responseCode === 0) {
          this.eventCaptcha = true;
        }
      }, err => console.log(err));
    console.log(event);
  }
  gotoLogin(e) {
    e.preventDefault();
    this._router.navigate(['auth/signin']);
  }
  hideAllErrMsg() {
    this.email_duplicate = false;
    this.out_maxSignupCount = false;
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.registerUser(this.registerForm.value);
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value));
  }
  openSmall(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title'})
    .result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log('Err!', reason);
    });
  }
  showTermsPrivacy() {
    const el: HTMLElement = this.termsModal_view.nativeElement as HTMLElement;
    el.click();
  }
  agree() {
    this.agree_val = !this.agree_val;
    console.log(this.agree_val);
  }
}
