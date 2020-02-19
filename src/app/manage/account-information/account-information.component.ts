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
  editLanguage: boolean;
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
    this.editLanguage = false;
    this.getUserInfo();
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
      language: new FormControl(),
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
        this.userForm.controls.language.setValue(this.userInfor.lang);
        // this.postcode = this.userInfor.postcode.value;
        console.log('userInfooo ', this.county);

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
        console.log('widtDrawAmoutt ', this.withdrawAmount);
      }
    });
  }

  showEditField(field: string) {
    console.log('999999 ', field);
    switch (field) {
      case 'address':
        this.editAddress = true;
        this.showSave = true;
        // this.userForm.controls.postCode = this.postcode;
        break;
      case 'email':
        this.editEmail = true;
        this.showSave = true;
        break;
      case 'phone':
        this.editPhone = true;
        this.showSave = true;
        break;
      case 'lang':
        this.editLanguage = true;
        this.showSave = true;
        break;
    }
  }

  cancelEdit(field: string) {
    switch (field) {
      case 'address':
        this.editAddress = false;
        this.showSave = false;
        break;
      case 'email':
        this.editEmail = false;
        this.showSave = false;
        break;
      case 'phone':
        this.editPhone = false;
        this.showSave = false;
        break;
      case 'lang':
        this.editLanguage = false;
        this.showSave = false;
        break;

    }

  }

  onClick() {
    $('#modal-confirm').modal('hide');
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    const param = {
      post_code: this.userForm.controls.postCode.value,

      prefecture: this.userForm.controls.searchPrefe.value,
      address: {
        county: this.userForm.controls.searchCountry.value,
        house_numb: this.userForm.controls.house_numb.value,
        email: this.userForm.controls.email.value,
      },
      phone: this.userForm.controls.phone.value,
      lang: this.userForm.controls.language.value
    };
    this.userService.updateUser(param).subscribe(response => {
      if (response.meta.code === 200) {

        this.showSave = false;
        this.editAddress = false;
        this.editEmail = false;
        this.editPhone = false;
        this.editLanguage = false;
        this.test = response.data.zip.status;
      }
    });
    // this.userService.getUserInfor(param).subscribe(response => {
    //   if (response.meta.code === 200) {
    //   }
    // });
  }
  // onSearchChange(searchValue: string): void {
  //   console.log(searchValue);
  // }

}
