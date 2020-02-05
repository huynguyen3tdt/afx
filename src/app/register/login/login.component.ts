import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';
declare const $: any;
declare const jqKeyboard: any;

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

    constructor() {
        jqKeyboard.init();
    }

    ngOnInit() {
        this.login_layout();
        $(window).resize(() => {
            this.login_layout();
        });
        this.initKeyboard();
        this.initLoginForm();
    }

    initLoginForm() {
        this.loginFormGroup = new FormGroup({
            userName: new FormControl('', requiredInput),
            passWord: new FormControl('', requiredInput),
            remember: new FormControl(),
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.loginFormGroup.invalid) {
            return;
        }
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          this.isPc = false;
        } else {
          this.isPc = true;
        }
        const param = {
            login_id: this.loginFormGroup.controls.userName.value,
            password: this.loginFormGroup.controls.passWord.value,
            device_type: isMobile === false ? 'Pc' : 'Mobile'
        };
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
