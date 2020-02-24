import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { Mt5Model, WithdrawAmountModel } from 'src/app/core/model/withdraw-request-response.model';
import { UserService } from './../../core/services/user.service';
import { UserModel } from 'src/app/core/model/user.model';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';

declare var $: any;

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {


  constructor(
    private translateee: TranslateService,
    private withdrawRequestService: WithdrawRequestService,
    private userService: UserService) { }
  accountInfor: Mt5Model;
  withdrawAmount: WithdrawAmountModel;
  editAddress: boolean;
  editEmail: boolean;
  editPhone: boolean;
  // editLanguage: boolean;
  userInfor: UserModel;
  userForm: FormGroup;
  countries = ['Vietnamese', 'English'];
  postcode: any;
  isSubmitted: boolean;
  prefecture: any;
  county: any;
  showSave = false;
  typeUser: string;
  test;

  ngOnInit() {
    this.initUserForm();
    this.editAddress = false;
    this.editEmail = false;
    this.editPhone = false;
    // this.editLanguage = false;
    this.getMt5Infor();
    this.getWithDrawAmount();
  }

  initUserForm() {
    this.userForm = new FormGroup({
      postCode: new FormControl('', requiredInput),
      searchPrefe: new FormControl(),
      searchCountry: new FormControl(),
      house_numb: new FormControl('', requiredInput),
      email: new FormControl('', requiredInput),
      phone: new FormControl('', requiredInput),
      // language: new FormControl(),
    });
  }

  changeLang(event) {
    this.translateee.use(event);
  }

  getUserInfo() {
    this.userService.getUserInfor().subscribe(response => {
      if (response.meta.code === 200) {
        this.userInfor = response.data;
        this.prefecture = response.data.address.value.city;
        this.county = response.data.address.value.street;
        this.userForm.controls.postCode.setValue(this.userInfor.zip.value);
        this.userForm.controls.searchPrefe.setValue(this.userInfor.address.value.city);
        this.userForm.controls.searchCountry.setValue(this.userInfor.address.value.street);
        this.userForm.controls.house_numb.setValue(this.userInfor.address.value.street2);
        this.userForm.controls.email.setValue(this.userInfor.email.value);
        this.userForm.controls.phone.setValue(this.userInfor.phone);
        // this.userForm.controls.language.setValue(this.userInfor.lang);
        // this.postcode = this.userInfor.postcode.value;
        console.log('userInfooo ', this.userInfor);

      }
    });
  }

  getMt5Infor() {
    this.withdrawRequestService.getmt5Infor().subscribe(response => {
      if (response.meta.code === 200) {
        this.accountInfor = response.data;
      }
    });
  }

  getWithDrawAmount() {
    this.withdrawRequestService.getDwAmount().subscribe(response => {
      if (response.meta.code === 200) {
        this.withdrawAmount = response.data;
      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.editAddress = false;
    this.editEmail = false;
    this.editPhone = false;
    // this.editLanguage = false;

    const param = {
      post_code: this.userForm.controls.postCode.value,
      prefecture: this.userForm.controls.searchPrefe.value,
      address: {
        county: this.userForm.controls.searchCountry.value,
        house_numb: this.userForm.controls.house_numb.value,
        email: this.userForm.controls.email.value,
      },
      phone: this.userForm.controls.phone.value,
      // lang: this.userForm.controls.language.value
    };
    this.userService.updateUser(param).subscribe(response => {
      if (response.meta.code === 200) {

        this.showSave = false;
        this.editAddress = false;
        this.editEmail = false;
        this.editPhone = false;
        // this.editLanguage = false;
        this.test = response.data.zip.status;
      }
    });
    // this.userService.getUserInfor(param).subscribe(response => {
    //   if (response.meta.code === 200) {
    //   }
    // });
  }

  showEditField(field: string) {
    this.showSave = true;
    switch (field) {
      case 'address':
        this.editAddress = true;
        break;
      case 'email':
        this.editEmail = true;
        break;
      case 'phone':
        this.editPhone = true;
        break;
      // case 'lang':
      //   this.editLanguage = true;
      //   break;
    }
  }

  cancelEdit(field: string) {
    this.showSave = false;
    switch (field) {
      case 'address':
        this.editAddress = false;
        break;
      case 'email':
        this.editEmail = false;
        break;
      case 'phone':
        this.editPhone = false;
        break;
      // case 'lang':
      //   this.editLanguage = false;
      //   break;

    }

  }

}
