import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  // @ViewChild('email', { static: false }) email: ElementRef;
  // @ViewChild('dateForm', { static: false }) dateForm: ElementRef;
  forgotPasswordForm: FormGroup;
  isSubmitted: boolean;

  constructor() { }

  ngOnInit() {
    this.initForgotPasswordForm();
  }
  initForgotPasswordForm() {
    this.forgotPasswordForm = new FormGroup({
        email: new FormControl('', requiredInput),
        dateInput: new FormControl('', requiredInput),
    });
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.forgotPasswordForm.invalid) {
        return;
    }
  }
}
