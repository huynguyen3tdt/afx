import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
import { USERNAME_LOGIN, PASSWORD_LOGIN, REMEMBER_LOGIN, TOKEN_AFX } from './../../core/constant/authen-constant';
import { Router } from '@angular/router';
import { AuthenService } from 'src/app/core/services/authen.service';
declare const $: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    @ViewChild('username', { static: false }) username: ElementRef;
    @ViewChild('password', { static: false }) password: ElementRef;
    loginFormGroup: FormGroup;
    isSubmitted: boolean;
    isPc: boolean;

    constructor(private router: Router, private authenService: AuthenService) {
    }

    ngOnInit() {
        this.login_layout();
        $(window).resize(() => {
            this.login_layout();
        });
        this.checkDevice();
        this.initKeyboard();
        this.initLoginForm();
    }

    initLoginForm() {
        this.loginFormGroup = new FormGroup({
            userName: new FormControl('', requiredInput),
            passWord: new FormControl('', requiredInput),
            remember: new FormControl(false),
        });
        if (localStorage.getItem(REMEMBER_LOGIN) === 'false' || localStorage.getItem(REMEMBER_LOGIN) === null) {
            this.loginFormGroup.controls.remember.setValue(false);
            this.loginFormGroup.controls.userName.setValue('');
            this.loginFormGroup.controls.passWord.setValue('');
        } else {
            this.loginFormGroup.controls.remember.setValue(true);
            if (this.checkUserNameAndPassWord(localStorage.getItem(USERNAME_LOGIN))) {
                this.loginFormGroup.controls.userName.setValue('');
            } else {
                this.loginFormGroup.controls.userName.setValue(atob(localStorage.getItem(USERNAME_LOGIN)));
            }
            if (this.checkUserNameAndPassWord(localStorage.getItem(PASSWORD_LOGIN))) {
                this.loginFormGroup.controls.passWord.setValue('');
            } else {
                this.loginFormGroup.controls.passWord.setValue(atob(localStorage.getItem(PASSWORD_LOGIN)));
            }
        }
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.loginFormGroup.invalid) {
            return;
        }
        const param = {
            login_id: this.loginFormGroup.controls.userName.value,
            password: this.loginFormGroup.controls.passWord.value,
            device_type: this.isPc ? 'Pc' : 'Mobile'
        };
        if (this.loginFormGroup.value.remember === true) {
            localStorage.setItem(USERNAME_LOGIN, btoa(this.loginFormGroup.value.userName));
            localStorage.setItem(PASSWORD_LOGIN, btoa(this.loginFormGroup.value.passWord));
            localStorage.setItem(REMEMBER_LOGIN, 'true');
        } else {
            localStorage.removeItem(USERNAME_LOGIN);
            localStorage.removeItem(PASSWORD_LOGIN);
            localStorage.setItem(REMEMBER_LOGIN, 'false');
        }
        this.authenService.login(param).subscribe(response => {
            if (response.meta.code === 200) {
            localStorage.setItem(TOKEN_AFX, response.data.access_token);
            this.router.navigate(['/manage/notifications']);
            }
        });
        $('.minimize-btn').click();
    }

    goToManage() {
        this.router.navigate(['/manage/notifications']);
    }

    changeToForgotPassWord() {
        this.router.navigate(['forgot_password']);
        $('.minimize-btn').click();
    }

    checkUserNameAndPassWord(loginParam) {
        if (loginParam === '' || loginParam === undefined || !loginParam) {
            return true;
        }
        return false;
    }

    checkDevice() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            this.isPc = false;
        } else {
            this.isPc = true;
        }
    }

    openKeyboard() {
        $('#jq-keyboard').toggleClass('show');
    }

    login_layout() {
        const screenHeight = $(window).height();
        const cardLoginWidth = $('.card-login').width();
        $('.site-wrapper').css('min-height', screenHeight);
        $('.card-login').css('min-height', (cardLoginWidth / 2) + 25);
    }

    initKeyboard() {
        setTimeout(() => {
            $('.minimize-btn').click(() => {
                $('.btn-toggle-vkeyboard').toggleClass('active');
                $('#user-focus-btn').removeClass('active');
                $('#password-focus-btn').removeClass('active');
            });

            $('#user-focus-btn').click(() => {
                this.username.nativeElement.focus();
                $('#user-focus-btn').addClass('active');
                $('#password-focus-btn').removeClass('active');
            });

            $('#password-focus-btn').click(() => {
                this.password.nativeElement.focus();
                $('#password-focus-btn').addClass('active');
                $('#user-focus-btn').removeClass('active');
            });
        }, 100);
    }
}
