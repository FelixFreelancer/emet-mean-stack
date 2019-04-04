import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
  animations: [SharedAnimations]
})
export class ForgotComponent implements OnInit {

  data: any = {};
  emailForResetPassword = '';
  invalidEmail = false;
  successEmail = false;
  constructor(
    private _auth: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  forget() {
    this._auth.forgot(this.data)
    .subscribe(
      res => {
        console.log(res);
        if ( res.msg === 'Sent Successfully') {
          this.successEmail = true;
          this.invalidEmail = false;
        }
        // localStorage.setItem('token', res.token);
        // this._router.navigate(['auth/signin']);
       },
      err => {
        console.log(err.error);
        if (err.error === 'Invalid email') {
          this.invalidEmail = true;
          this.successEmail = false;
        }
      });
  }

}
