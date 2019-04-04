import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
// import { AuthService } from './auth.service';
import { AuthService } from '../../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthUserGaurd implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  canActivate() {
    if (this.auth.authenticated && this.auth.role === 0) {
      return true;
    } else {
      this.router.navigateByUrl('/auth/signin');
    }
  }
}
