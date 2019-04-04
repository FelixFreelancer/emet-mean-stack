import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Router, ActivatedRoute, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from '../_helpers/must-match.validator';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
  animations: [SharedAnimations]
})
export class ResetComponent implements OnInit {

  data: any = {};
  emailForResetPassword = '';
  invalidEmail = false;
  successPassword = false;
  resetPasswordForm: FormGroup;
  submitted = false;
  token = '';
  constructor(
    private _auth: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required]
      }, {
        validator: MustMatch('password', 'confirmPassword')
    });

    this.route.params.subscribe(params => {
      this.token = params.token;
    });
  }

   // convenience getter for easy access to form fields
   get f() { return this.resetPasswordForm.controls; }


  reset() {
    this._auth.reset(this.data)
    .subscribe(
      res => {
        console.log(res);
        if (res.msg === 'changed successfully') {
            this.successPassword = true;
        }
       },
      err => {
        console.log(err.error);
      });
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
        return;
    }
    this.data.password = this.resetPasswordForm.value.password;
    this.data.token = this.token;
    this.reset();
    // this.registerUser(this.resetPasswordForm.value);
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value));
}
}
