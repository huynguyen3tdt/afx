import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { emailValidation } from 'src/app/core/helper/custom-validate.helper';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css']
})
export class ChangeEmailComponent implements OnInit {
  changeEmailForm: FormGroup;
  token: string;
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(res => {
      if (res.token) {
        this.token = res.token;
      }
    });
    this.initChangeEmailForm();
  }

  initChangeEmailForm() {
    this.changeEmailForm = new FormGroup({
      email: new FormControl('', [emailValidation])
    });
  }

  onSubmit() {
    const param = {
      email: this.changeEmailForm.controls.email.value,
      token: this.token
    };
  }

}
