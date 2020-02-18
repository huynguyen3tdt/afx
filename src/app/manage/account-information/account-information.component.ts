import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WithdrawRequestService } from 'src/app/core/services/withdraw-request.service';
import { Mt5Model, WithdrawAmountModel } from 'src/app/core/model/withdraw-request-response.model';
import { UserService } from './../../core/services/user.service';
import { UserModel } from 'src/app/core/model/user.model';
import { FormGroup, FormControl } from '@angular/forms';
import { requiredInput } from 'src/app/core/helper/custom-validate.helper';

@Component({
  selector: 'app-account-information',
  templateUrl: './account-information.component.html',
  styleUrls: ['./account-information.component.css']
})
export class AccountInformationComponent implements OnInit {
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

  constructor(
    private translateee: TranslateService,
    private withdrawRequestService: WithdrawRequestService,
    private userService: UserService) { }

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
        this.userForm.controls.postCode.setValue(this.userInfor.postcode.value);
        this.userForm.controls.searchPrefe.setValue(this.userInfor.address.value.prefecture);
        this.userForm.controls.searchCountry.setValue(this.userInfor.address.value.county);
        this.userForm.controls.house_numb.setValue(this.userInfor.address.value.house_numb);
        this.userForm.controls.email.setValue(this.userInfor.email.value);
        this.userForm.controls.phone.setValue(this.userInfor.phone);
        this.userForm.controls.language.setValue(this.userInfor.language);
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
        console.log('widtDrawAmoutt ', this.withdrawAmount);
      }
    });
  }

  showEditField(field: string) {
    console.log('999999 ', field);
    switch (field) {
      case 'address':
        this.editAddress = true;
        // this.userForm.controls.postCode = this.postcode;
        break;
      case 'email':
        this.editEmail = true;
        break;
      case 'phone':
        this.editPhone = true;
        break;
      case 'lang':
        this.editLanguage = true;
        break;
    }
  }

  cancelEdit(field: string) {
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
      case 'lang':
        this.editLanguage = false;
        break;
    }
  }
  onSave() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    // const param = {
    //   postCode: this.userForm.controls.postCode.value,
    //   searchPrefe: this.userForm.controls.searchPrefe.value,
    //   searchCountry: this.userForm.controls.searchCountry.value,
    //   house_numb: this.userForm.controls.house_numb.value,
    //   email: this.userForm.controls.email.value,
    //   phone: this.userForm.controls.phone.value,
    //   language: this.userForm.controls.language.value
    // };
    // this.userService.getUserInfor(param).subscribe(response => {
    //   if (response.meta.code === 200) {
    //   }
    // });
  }
}
