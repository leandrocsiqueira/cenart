import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from 'src/shared/global-constants';
import { AppUserService } from '../services/app-user.service';
import { SnackbarService } from '../services/snackbar.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private _appUserService: AppUserService,
    private _ngxService: NgxUiLoaderService,
    private _snackBarService: SnackbarService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      password: [null, [Validators.required]],
    });
  }

  handleSubmit() {
    this._ngxService.start();
    const FORM_DATA = this.loginForm.value;

    const DATA = {
      email: FORM_DATA.email,
      password: FORM_DATA.password,
    };

    this._appUserService.login(DATA).subscribe(
      (response: any) => {
        this._ngxService.stop();
        localStorage.setItem('token', response.token);
        this.router.navigate(['/cenart/dashboard']);
      },
      (error) => {
        console.log(error);
        this._ngxService.stop();

        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }

        this._snackBarService.openSnackBar(this.responseMessage);
      }
    );
  }

  onBack() {
    this.router.navigate(['/home']);
  }
}
