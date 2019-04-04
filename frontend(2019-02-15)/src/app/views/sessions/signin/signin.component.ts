import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { AuthService } from '../../../shared/services/auth.service';
import { AuthService } from '../../../service/auth.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [SharedAnimations]
})
export class SigninComponent implements OnInit {
    loading: boolean;
    loadingText: string;
    loading1: boolean;
    loadingText1: string;
    signinForm: FormGroup;
    flag = true;
    submitted = false;
    invalid_email = false;
    invalid_password = false;
    deactived_user = false;
    loginUserData = {};
    constructor(
        private fb: FormBuilder,
        private _auth: AuthService,
        private router: Router,
    ) { }
    get f() { return this.signinForm.controls; }
    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
                if (this.flag) {
                    this.loadingText = 'Loading Home Module...';
                    this.loading = true;
                } else {
                    this.loadingText1 = 'Loading Anonymous Module...';
                    this.loading1 = true;
                }
            }
            if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
                if (this.flag) {
                    this.loading = false;
                } else {
                    this.loading1 = false;
                }
            }
        });

        this.signinForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
    signinAnonymous() {
            localStorage.clear();
            this.flag = false;
            this._auth.authenticated = true;
            // localStorage.setItem('token', res.token);
            localStorage.setItem('role', '0');
            localStorage.setItem('userName', 'Anonymous User');
            localStorage.setItem('userId', '-1');
            localStorage.setItem('picture', 'default.png');
            localStorage.setItem('extraBlob', '0');
            this._auth.setStorageItem('login_status', true);
            this.router.navigate(['/item/list']);
    }
    deleteAllCookies() {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    }
    signin() {
        this.submitted = true;
        this.flag = true;
        // stop here if form is invalid
        if (this.signinForm.invalid) {
            return;
        }
        this._auth.loginUser(this.signinForm.value)
        .subscribe(
          res => {
            this._auth.authenticated = true;
            localStorage.setItem('token', res.token);
            localStorage.setItem('role', res.role);
            localStorage.setItem('userName', res.userName);
            localStorage.setItem('userId', res.userId);
            localStorage.setItem('picture', res.picture);
            localStorage.setItem('extraBlob', res.extraBlob);
            this._auth.setStorageItem('login_status', true);
            this._auth.setRole(res.role);
            if (res.role === 1) { // admin
                this.router.navigate(['/user/list']);
            } else { // user
                this.router.navigate(['/item/list']);
            }
            this.deleteAllCookies();
           },
          err => {
              console.log(err);

              if (err.error === 'Invalid email') {
                this.invalid_email = true;
              }
              if (err.error === 'Invalid password') {
                this.invalid_password = true;
              }
              if (err.error === 'deactived user') {
                this.deactived_user = true;
              }
        }
          );
    }

}
